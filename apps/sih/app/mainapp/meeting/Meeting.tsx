'use client';

import React, { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { Mic, MicOff, Video, VideoOff, Maximize, Pin, PinOff, PhoneOff, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SIGNALING_SERVER_URL = process.env.NEXT_PUBLIC_SIGNALING_URL || 'http://localhost:8080';

const VideoCard = ({
  stream,
  isMuted,
  isLocal,
  isPinned,
  participantId,
  onPin,
  variant = 'thumbnail',
}: {
  stream: MediaStream;
  isMuted: boolean;
  isLocal: boolean;
  isPinned: boolean;
  participantId: string;
  onPin: () => void;
  variant?: 'main' | 'thumbnail';
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };
  
  const cardStyle = isPinned && variant === 'thumbnail' ? 'border-4 border-white/40 shadow-2xl shadow-white/10' : 'border-2 border-white/20';
  const mentorStyle = isLocal && variant === 'main' ? 'border-4 border-white/50 shadow-2xl shadow-white/20' : '';

  return (
    <div ref={containerRef} className={`relative aspect-video bg-black/30 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group hover:shadow-3xl hover:shadow-white/5 ${cardStyle} ${mentorStyle}`}>
      <video ref={videoRef} autoPlay playsInline muted={isMuted} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm">
        <span className="text-white text-sm font-bold drop-shadow-lg bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          {isLocal ? "You" : `Participant ${participantId.substring(0, 4)}`}
        </span>
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button onClick={onPin} className="p-2 bg-white/15 backdrop-blur-lg rounded-full text-white hover:bg-white/25 border border-white/20 shadow-xl hover:scale-110 transition-all duration-300">
          {variant === 'main' && !isLocal ? <PinOff size={18} /> : <Pin size={16} />}
        </button>
        <button onClick={toggleFullscreen} className="p-2 bg-white/15 backdrop-blur-lg rounded-full text-white hover:bg-white/25 border border-white/20 shadow-xl hover:scale-110 transition-all duration-300">
          <Maximize size={variant === 'main' ? 18 : 16} />
        </button>
      </div>
    </div>
  );
};


export default function MeetingRoom({ meetingId, userRole }: { meetingId: string, userRole: string }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoHidden, setIsVideoHidden] = useState(false);
  const [mainStream, setMainStream] = useState<{ id: string, stream: MediaStream } | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});

  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const router = useRouter();

  useEffect(() => {
    const newSocket = io(SIGNALING_SERVER_URL);
    setSocket(newSocket);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        if (userRole === 'MENTOR') {
          setMainStream({ id: 'local', stream });
        }
        setIsLoading(false);
        newSocket.emit('join-room', meetingId);
      })
      .catch(error => {
        console.error('Error accessing media devices.', error);
        setIsLoading(false);
      });

    return () => {
      newSocket.disconnect();
      localStream?.getTracks().forEach(track => track.stop());
      Object.values(peerConnections.current).forEach(pc => pc.close());
    };
  }, [meetingId, userRole]);

  useEffect(() => {
    if (!socket || !localStream) return;

    const createPeerConnection = (socketId: string) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { target: socketId, candidate: event.candidate });
        }
      };
      
      pc.ontrack = (event) => {
          setRemoteStreams(prev => ({ ...prev, [socketId]: event.streams[0] as any }));
          if(userRole === 'STUDENT' && !mainStream) {
            setMainStream({ id: socketId, stream: event.streams[0] as any });
          }
      };

      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      peerConnections.current[socketId] = pc;
      return pc;
    };

    socket.on('user-connected', async (socketId: string) => {
        const pc = createPeerConnection(socketId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', { target: socketId, sdp: pc.localDescription });
    });

    socket.on('offer', async (data: { from: string; sdp: RTCSessionDescriptionInit }) => {
        const pc = createPeerConnection(data.from);
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { target: data.from, sdp: pc.localDescription });
    });

    socket.on('answer', async (data: { from: string; sdp: RTCSessionDescriptionInit }) => {
        const pc = peerConnections.current[data.from];
        if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        }
    });

    socket.on('ice-candidate', (data: { from: string; candidate: RTCIceCandidateInit }) => {
        const pc = peerConnections.current[data.from];
        if (pc) {
            pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    });

    socket.on('user-disconnected', (socketId: string) => {
      peerConnections.current[socketId]?.close();
      delete peerConnections.current[socketId];
      
      const newRemoteStreams = { ...remoteStreams };
      delete newRemoteStreams[socketId];
      setRemoteStreams(newRemoteStreams);
      
      if(mainStream?.id === socketId) {
        if(userRole === 'MENTOR' && localStream) {
            setMainStream({id: 'local', stream: localStream});
        } else {
            const firstRemote = Object.entries(newRemoteStreams)[0];
             if(firstRemote) {
                setMainStream({id: firstRemote[0], stream: firstRemote[1]});
             } else if (userRole === 'STUDENT' && localStream) {
                setMainStream({id: 'local', stream: localStream});
             } else {
                setMainStream(null);
             }
        }
      }
    });

  }, [socket, localStream, userRole, mainStream]);

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoHidden(!videoTrack.enabled);
        }
    }
  };
  
  const handlePin = (id: string, stream: MediaStream) => {
    if (mainStream?.id === id) { 
      if (userRole === 'MENTOR' && localStream) {
        setMainStream({ id: 'local', stream: localStream });
      } else {
        const firstRemote = Object.entries(remoteStreams)[0];
        if (firstRemote) {
          setMainStream({ id: firstRemote[0], stream: firstRemote[1] });
        }
      }
    } else {
      setMainStream({ id, stream });
    }
  };

  const participants = [
      ...(localStream && (userRole === "STUDENT" || mainStream?.id !== 'local') ? [{ id: 'local', stream: localStream }] : []),
      ...Object.entries(remoteStreams).map(([id, stream]) => ({ id, stream }))
  ];
  const thumbnailParticipants = participants.filter(p => p.id !== mainStream?.id);
  
  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-full bg-transparent">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 p-12 text-center">
                <LoaderCircle className="mx-auto h-16 w-16 text-white animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Connecting to meeting...
                </h2>
                <p className="text-gray-300 font-medium">Please allow camera and microphone access.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="h-full bg-transparent flex flex-col md:flex-row p-4 gap-4">
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="w-full h-full flex items-center justify-center">
                {mainStream ? (
                    <VideoCard 
                        stream={mainStream.stream} 
                        isMuted={mainStream.id === 'local'} 
                        isLocal={mainStream.id === 'local'}
                        isPinned={true}
                        participantId={mainStream.id}
                        onPin={() => handlePin(mainStream.id, mainStream.stream)} 
                        variant="main"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl">
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                                <Video className="w-12 h-12 text-white/60" />
                            </div>
                            <p className="text-white/80 text-lg font-medium">Waiting for participants...</p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Glass Control Panel */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/25 rounded-3xl flex justify-center items-center gap-6 shadow-2xl shadow-black/20 p-6">
                <button 
                    onClick={toggleAudio} 
                    className={`p-4 rounded-2xl transition-all duration-300 backdrop-blur-lg border-2 shadow-xl hover:scale-110 ${
                        isAudioMuted 
                            ? 'bg-red-500/80 border-red-400/50 text-white shadow-red-500/20' 
                            : 'bg-white/15 border-white/25 text-white hover:bg-white/25'
                    }`}
                >
                    {isAudioMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                
                <button 
                    onClick={toggleVideo} 
                    className={`p-4 rounded-2xl transition-all duration-300 backdrop-blur-lg border-2 shadow-xl hover:scale-110 ${
                        isVideoHidden 
                            ? 'bg-red-500/80 border-red-400/50 text-white shadow-red-500/20' 
                            : 'bg-white/15 border-white/25 text-white hover:bg-white/25'
                    }`}
                >
                    {isVideoHidden ? <VideoOff size={24} /> : <Video size={24} />}
                </button>
                
                <button 
                    onClick={() => router.back()} 
                    className="p-4 rounded-2xl bg-red-500/80 border-2 border-red-400/50 text-white hover:bg-red-400/90 transition-all duration-300 backdrop-blur-lg shadow-xl shadow-red-500/20 hover:scale-110"
                >
                    <PhoneOff size={24} />
                </button>
            </div>
        </div>

        {/* Glass Participants Panel */}
        <div className="w-full md:w-64 bg-white/8 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto shadow-2xl shadow-black/20">
            <div className="hidden md:block mb-4">
                <h2 className="font-bold text-white text-xl mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Participants
                </h2>
                <div className="text-sm text-gray-300 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 inline-block border border-white/20">
                  {participants.length} online
                </div>
            </div>
            
            {thumbnailParticipants.map(({ id, stream }) => (
                <div key={id} className="w-48 md:w-full flex-shrink-0">
                    <VideoCard 
                        stream={stream} 
                        isMuted={id === 'local'} 
                        isLocal={id === 'local'}
                        isPinned={id === mainStream?.id}
                        participantId={id}
                        onPin={() => handlePin(id, stream)} 
                    />
                </div>
            ))}
            
             {userRole === "STUDENT" && localStream && mainStream?.id !== 'local' && thumbnailParticipants.every(p => p.id !== 'local') && (
                <div className="w-48 md:w-full flex-shrink-0">
                    <VideoCard 
                        stream={localStream}
                        isMuted={true}
                        isLocal={true}
                        isPinned={false}
                        participantId={'local'}
                        onPin={() => handlePin('local', localStream)} 
                    />
                </div>
             )}
        </div>
    </div>
  );
}