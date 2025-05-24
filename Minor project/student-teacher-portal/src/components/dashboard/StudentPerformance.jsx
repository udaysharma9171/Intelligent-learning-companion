import React, { useEffect, useState } from "react";
import StudentPerformanceChart from "../ui/StudentPerformanceChart";
import { useAuth } from "../../contexts/AuthContext";

const StudentPerformance = () => {
  const { user } = useAuth();
  const [studentPerformanceData, setStudentPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentPerformanceData = async () => {
      try {
        const userId = user?.userId || localStorage.getItem('userId');

        if (!userId) {
          console.error("No userId found");
          return;
        }

        console.log("Fetching performance data for student ID:", userId);

        const response = await fetch(`http://127.0.0.1:5000/api/students/${userId}`);
        const result = await response.json();

        if (response.ok && result.student) {
          const data = [
            result.student.quiz_score_1 * 100,
            result.student.quiz_score_2 * 100,
            result.student.quiz_score_3 * 100,
            result.student.assignment_score_1 * 100,
            result.student.assignment_score_2 * 100,
          ];
          console.log("Fetched Performance Data:", data);
          setStudentPerformanceData(data);
        } else {
          console.error("Error fetching performance data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentPerformanceData();
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (studentPerformanceData.length === 0) {
    return <p>No performance data available.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Performance Trends</h2>
      <StudentPerformanceChart data={studentPerformanceData} />
    </div>
  );
};

export default StudentPerformance;