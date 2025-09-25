import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import {
  getMentorCommunityProjects,
  getStudentCommunityProjects,
  createCommunityProject,
  updateProjectSubmissionStatus,
  createCommunityProjectSubmission
} from '../../../actions/community-projects/actions';
import MentorCommunityProjects from '@repo/ui/community/MentorCommunityProjects';
import StudentCommunityProjects from '@repo/ui/community/StudentCommunityProjects';
import { supabase } from '../../../lib/supabase';

// Helper function to get public URLs for a list of items
const getPublicUrls = (items: any[], imageKey: string) => {
    for (const item of items) {
        if (item[imageKey]) {
            const { data } = supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!).getPublicUrl(item[imageKey]);
            item[imageKey] = data.publicUrl;
        }
    }
}

export default async function CommunityProjectsPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  if (userRole === 'MENTOR') {
    const projects = await getMentorCommunityProjects();
    
    // Get public URLs for project images and submission images
    for (const p of projects) {
        if (p.imageUrl) {
            const { data } = supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!).getPublicUrl(p.imageUrl);
            p.imageUrl = data.publicUrl;
        }
        getPublicUrls(p.submissions, 'answerImageUrl');
    }

    return (
        <MentorCommunityProjects 
            projects={projects}
            handleCreateProject={createCommunityProject}
            handleStatusUpdate={updateProjectSubmissionStatus}
        />
    );
  }

  if (userRole === 'STUDENT') {
    const projects = await getStudentCommunityProjects();
    
    // Get public URLs for project images and submission images
    for (const p of projects) {
      if (p.imageUrl) {
        const { data } = supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!).getPublicUrl(p.imageUrl);
        p.imageUrl = data.publicUrl;
      }
      getPublicUrls(p.submissions, 'answerImageUrl');
    }

    return (
        <StudentCommunityProjects 
            projects={projects}
            handleSubmitAnswer={createCommunityProjectSubmission}
        />
    );
  }

  return <div>Not authorized to view this page.</div>;
}
