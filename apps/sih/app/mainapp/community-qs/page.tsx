import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import {
  getMentorCommunityQuestions,
  getStudentCommunityQuestions,
  createCommunityQuestion,
  updateSubmissionStatus,
  createCommunityQuestionSubmission
} from '../../../actions/community/actions';
import MentorCommunityQs from '@repo/ui/community/MentorCommunityQs';
import StudentCommunityQs from '@repo/ui/community/StudentCommunityQs';
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

export default async function CommunityQsPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  if (userRole === 'MENTOR') {
    const questions = await getMentorCommunityQuestions();
    
    // Get public URLs for question images and submission images
    for (const q of questions) {
        if (q.imageUrl) {
            const { data } = supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!).getPublicUrl(q.imageUrl);
            q.imageUrl = data.publicUrl;
        }
        getPublicUrls(q.submissions, 'answerImageUrl');
    }

    return (
        <MentorCommunityQs 
            questions={questions}
            handleCreateQuestion={createCommunityQuestion}
            handleStatusUpdate={updateSubmissionStatus}
        />
    );
  }

  if (userRole === 'STUDENT') {
    const questions = await getStudentCommunityQuestions();
    
    // Get public URLs for question images and submission images
    for (const q of questions) {
      if (q.imageUrl) {
        const { data } = supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!).getPublicUrl(q.imageUrl);
        q.imageUrl = data.publicUrl;
      }
      getPublicUrls(q.submissions, 'answerImageUrl');
    }


    return (
        <StudentCommunityQs 
            questions={questions}
            handleSubmitAnswer={createCommunityQuestionSubmission}
        />
    );
  }

  return <div>Not authorized to view this page.</div>;
}