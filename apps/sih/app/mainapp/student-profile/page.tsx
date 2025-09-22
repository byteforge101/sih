// apps/sih/app/mainapp/student-profile/page.tsx

import { StudentProfileForm } from "@repo/ui/StudentProfileForm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "@repo/prisma/client";
import { updateDropoutDetails } from "../../../actions/student/update-dropout-details"; // Import the action
import { StudentProfileCard } from "@repo/ui/StudentProfileCard";

export default async function StudentProfile() {
    const session = await getServerSession(authOptions);
   if (!session?.user) {
        return <div>Unauthorized</div>;
    }
    const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
        include: {
            user: true,
        },
    });

    if (!student) {
        return <div>Student not found</div>;
    }

    if (student.profileCompleted) {
        return (
            
            <StudentProfileCard student={student} />
            
        );
    }

    // Hardcoded dropdown options
    const applicationModes =[
        "1st phase—general contingent",
        "Ordinance No. 612/93",
        "1st phase—special contingent (Azores Island)",
        "Holders of other higher courses",
        "Ordinance No. 854-B/99",
        "International student (bachelor)",
        "1st phase—special contingent (Madeira Island)",
        "2nd phase—general contingent",
        "3rd phase—general contingent",
        "Ordinance No. 533-A/99, item b2) (Different Plan)",
        "Ordinance No. 533-A/99, item b3 (Other Institution)",
        "Over 23 years old",
        "Transfer",
        "Change in course",
        "Technological specialization diploma holders",
        "Change in institution/course",
        "Short cycle diploma holders",
        "Change in institution/course (International)"
      ];
    const courses = [
        "Biofuel Production Technologies",
        "Animation and Multimedia Design",
        "Social Service (evening attendance)",
        "Agronomy",
        "Communication Design",
        "Veterinary Nursing",
        "Informatics Engineering",
        "Equiniculture",
        "Management",
        "Social Service",
        "Tourism",
        "Nursing",
        "Oral Hygiene",
        "Advertising and Marketing Management",
        "Journalism and Communication",
        "Basic Education",
        "Management (evening attendance)"
      ];
      
    const attendanceRegimes = ["Daytime", "Evening"];
    const previousQualifications = [
        "Secondary education",
        "Higher education—bachelor’s degree",
        "Higher education—degree",
        "Higher education—master’s degree",
        "Higher education—doctorate",
        "Frequency of higher education",
        "12th year of schooling—not completed",
        "11th year of schooling—not completed",
        "Other—11th year of schooling",
        "10th year of schooling",
        "10th year of schooling—not completed",
        "Basic education 3rd cycle (9th/10th/11th year) or equivalent",
        "Basic education 2nd cycle (6th/7th/8th year) or equivalent",
        "Technological specialization course",
        "Higher education—degree (1st cycle)",
        "Professional higher technical course",
        "Higher education—master’s degree (2nd cycle)"
      ];
    const parentQualifications = [
        "Secondary Education—12th Year of Schooling or Equivalent",
        "Higher Education—bachelor’s degree",
        "Higher Education—degree",
        "Higher Education—master’s degree",
        "Higher Education—doctorate",
        "Frequency of Higher Education",
        "12th Year of Schooling—not completed",
        "11th Year of Schooling—not completed",
        "7th Year (Old)",
        "Other—11th Year of Schooling",
        "2nd year complementary high school course",
        "10th Year of Schooling",
        "General commerce course",
        "Basic Education 3rd Cycle (9th/10th/11th Year) or Equivalent",
        "Complementary High School Course",
        "Technical-professional course",
        "Complementary High School Course—not concluded",
        "7th year of schooling",
        "2nd cycle of the general high school course",
        "9th Year of Schooling—not completed",
        "8th year of schooling",
        "General Course of Administration and Commerce",
        "Supplementary Accounting and Administration",
        "Unknown",
        "Cannot read or write",
        "Can read without having a 4th year of schooling",
        "Basic education 1st cycle (4th/5th year) or equivalent",
        "Basic Education 2nd Cycle (6th/7th/8th Year) or equivalent",
        "Technological specialization course",
        "Higher education—degree (1st cycle)",
        "Specialized higher studies course",
        "Professional higher technical course",
        "Higher Education—master’s degree (2nd cycle)",
        "Higher Education—doctorate (3rd cycle)"
      ];
      
    const parentOccupations = [
        "Student",
        "Representatives of the Legislative Power and Executive Bodies, Directors, Directors and Executive Managers",
        "Specialists in Intellectual and Scientific Activities",
        "Intermediate Level Technicians and Professions",
        "Administrative staff",
        "Personal Services, Security and Safety Workers, and Sellers",
        "Farmers and Skilled Workers in Agriculture, Fisheries, and Forestry",
        "Skilled Workers in Industry, Construction, and Craftsmen",
        "Installation and Machine Operators and Assembly Workers",
        "Unskilled Workers",
        "Armed Forces Professions",
        "Other Situation; 13—(blank)",
        "Armed Forces Officers",
        "Armed Forces Sergeants",
        "Other Armed Forces personnel",
        "Directors of administrative and commercial services",
        "Hotel, catering, trade, and other services directors",
        "Specialists in the physical sciences, mathematics, engineering, and related techniques",
        "Health professionals",
        "Teachers",
        "Specialists in finance, accounting, administrative organization, and public and commercial relations",
        "Intermediate level science and engineering technicians and professions",
        "Technicians and professionals of intermediate level of health",
        "Intermediate level technicians from legal, social, sports, cultural, and similar services",
        "Information and communication technology technicians",
        "Office workers, secretaries in general, and data processing operators",
        "Data, accounting, statistical, financial services, and registry-related operators",
        "Other administrative support staff",
        "Personal service workers",
        "Sellers",
        "Personal care workers and the like",
        "Protection and security services personnel",
        "Market-oriented farmers and skilled agricultural and animal production workers",
        "Farmers, livestock keepers, fishermen, hunters and gatherers, and subsistence",
        "Skilled construction workers and the like, except electricians",
        "Skilled workers in metallurgy, metalworking, and similar",
        "Skilled workers in electricity and electronics",
        "Workers in food processing, woodworking, and clothing and other industries and crafts",
        "Fixed plant and machine operators",
        "Assembly workers",
        "Vehicle drivers and mobile equipment operators",
        "Unskilled workers in agriculture, animal production, and fisheries and forestry",
        "Unskilled workers in extractive industry, construction, manufacturing, and transport",
        "Meal preparation assistants",
        "Street vendors (except food) and street service provider"
      ];
    const genders = ["Male", "Female"];
    const yesNoOptions = ["Yes", "No"];


    return (
        <div className="container mx-auto w-full">
            
            <StudentProfileForm
                applicationModes={applicationModes}
                courses={courses}
                attendanceRegimes={attendanceRegimes}
                previousQualifications={previousQualifications}
                parentQualifications={parentQualifications}
                parentOccupations={parentOccupations}
                genders={genders}
                yesNoOptions={yesNoOptions}
                updateAction={updateDropoutDetails} // Pass the action as a prop
            />
        </div>
    );
}