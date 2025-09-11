import { getMentees } from "../../../actions/mentor/get-mentees";
import { MenteeList } from "./mentee-list";

export default async function MyMenteesPage() {
  
  const mentees = await getMentees();

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Mentees</h1>
        <p className="mt-1 text-gray-600">
          An overview of your assigned students. Students marked "At Risk" may require immediate attention.
        </p>
      </div>
      
      {}
      <MenteeList mentees={mentees} />
    </div>
  );
}