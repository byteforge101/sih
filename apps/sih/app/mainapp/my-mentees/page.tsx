import { getMentees } from "../../../actions/mentor/get-mentees";
import { MenteeList } from "./mentee-list";

export default async function MyMenteesPage() {
  try {
    const mentees = await getMentees();
    return (
      // --- STYLING CHANGE: Removed background gradient and updated padding/text colors ---
      <div className="min-h-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100">My Mentees</h1>
          <p className="mt-2 text-lg text-slate-400">
            An overview of your assigned students. Students marked "At Risk" may require immediate attention.
          </p>
        </div>
        
        {/* Functional component remains unchanged */}
        <MenteeList mentees={mentees} />
      </div>
  );} catch (error) {
    console.error("Failed to fetch mentees:", error);
    // --- STYLING CHANGE: Updated error message color ---
    return <div className="text-rose-400 text-center p-8">Failed to fetch mentees</div>;
  }
}