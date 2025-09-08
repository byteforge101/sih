'use client';
import { useEffect, useState } from 'react';
import { getStudentDashboardData } from '../../../actions/student/get-student-data';
import { getMentorDashboardData } from '../../../actions/mentor/get-mentor-data';
import { getGuardianDashboardData } from '../../../actions/guardian/get-guardian-ata';


import StudentDashboard from '@repo/ui/dashboard/student-dashboard';
import MentorDashboard from '@repo/ui/dashboard/mentor-dashboard';
import GuardianDashboard from '@repo/ui/dashboard/guardian-dashboard';
import { addMentee } from '../../../actions/mentor/add-mentee';
import { searchStudents } from '../../../actions/mentor/search-students';



export  function StudentDashboardLoader() {
    const [data, setData] = useState<any>(null);
    useEffect(() => {
        async function fetchData() {
            const dt = await getStudentDashboardData();
            setData(dt);
        }
        fetchData();
    }, []);
    if (!data) return <div>Loading...</div>;
    return <StudentDashboard data={data} />;
}

export function MentorDashboardLoader() {
    const [data, setData] = useState<any>(null);
    useEffect(() => {
        async function fetchData() {
            const dt = await getMentorDashboardData();
            setData(dt);
        }
        fetchData();
    }, []);
    if (!data) return <div>Loading...</div>;
    return <MentorDashboard data={data} searchStudentsAction={searchStudents} addMenteeAction={addMentee} />;
}

export function GuardianDashboardLoader() {
    const [data, setData] = useState<any>(null);
    useEffect(() => {
        async function fetchData() {
            const dt = await getGuardianDashboardData();
            setData(dt);
        }
        fetchData();
    }, []);
    if (!data) return <div>Loading...</div>;
    return <GuardianDashboard data={data} />;
}
