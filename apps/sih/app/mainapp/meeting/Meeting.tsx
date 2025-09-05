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
  
  const cardStyle = isPinned && variant === 'thumbnail' ? 'border-4 border-blue-500' : 'border-4 border-transparent';
  const mentorStyle = isLocal && variant === 'main' ? 'border-4 border-violet-500 shadow-violet-500/20' : '';

  return (
    <div ref={containerRef} className={`relative aspect-video bg-slate-700 rounded-xl overflow-hidden shadow-lg transition-all duration-300 group ${cardStyle} ${mentorStyle}`}>
      <video ref={videoRef} autoPlay playsInline muted={isMuted} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
        <span className="text-white text-sm font-medium drop-shadow-md">{isLocal ? "You" : `Participant ${participantId.substring(0, 4)}`}</span>
      </div>
      <div className="absolute top-2 right-2 flex items-center gap-2 transition-opacity duration-300">
        <button onClick={onPin} className="p-2 bg-black/40 rounded-full text-white hover:bg-blue-500 backdrop-blur-sm">
          {variant === 'main' && !isLocal ? <PinOff size={20} /> : <Pin size={16} />}
        </button>
        <button onClick={toggleFullscreen} className="p-2 bg-black/40 rounded-full text-white hover:bg-blue-500 backdrop-blur-sm">
          <Maximize size={variant === 'main' ? 20 : 16} />
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
        <div className="flex items-center justify-center h-full bg-slate-100">
            <div className="text-center">
                <LoaderCircle className="mx-auto h-12 w-12 text-violet-500 animate-spin" />
                <h2 className="mt-4 text-lg font-medium text-slate-700">Connecting to meeting...</h2>
                <p className="text-slate-500">Please allow camera and microphone access.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="h-full bg-slate-100 flex flex-col md:flex-row p-4 gap-4">
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
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
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 rounded-xl">
                        <p className="text-slate-500">Waiting for participants...</p>
                    </div>
                )}
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-full flex justify-center items-center gap-4 shadow-lg">
                <button onClick={toggleAudio} className={`p-4 rounded-full transition-colors ${isAudioMuted ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                    {isAudioMuted ? <MicOff /> : <Mic />}
                </button>
                <button onClick={toggleVideo} className={`p-4 rounded-full transition-colors ${isVideoHidden ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                    {isVideoHidden ? <VideoOff /> : <Video />}
                </button>
                 <button onClick={() => router.back()} className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                    <PhoneOff />
                </button>
            </div>
        </div>

        <div className="w-full md:w-64 bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-4 flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto">
            <h2 className="font-bold text-slate-700 text-lg hidden md:block">Participants ({participants.length})</h2>
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