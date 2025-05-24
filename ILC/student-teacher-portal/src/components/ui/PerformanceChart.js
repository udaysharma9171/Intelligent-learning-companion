import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const PerformanceChart = () => {
    const chartRef = useRef(null); // Ref for the canvas element
    const chartInstance = useRef(null); // Ref for the Chart.js instance

    const [students, setStudents] = useState([]); // All students
    const [selectedStudent, setSelectedStudent] = useState(null); // Selected student ID
    const [performanceData, setPerformanceData] = useState([]); // Performance data for the selected student

    // Fetch all students for the dropdown
    useEffect(() => {
        axios
            .get("http://127.0.0.1:5000/api/students")
            .then((response) => {
                setStudents(response.data.students);
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
            });
    }, []);

    // Fetch performance data for the selected student
    useEffect(() => {
        if (selectedStudent) {
            axios
                .get(`http://127.0.0.1:5000/api/students/${selectedStudent}`)
                .then((response) => {
                    const student = response.data.student;
                    setPerformanceData([
                        student.quiz_score_1,
                        student.quiz_score_2,
                        student.quiz_score_3,
                        student.assignment_score_1,
                        student.assignment_score_2,
                    ]);
                })
                .catch((error) => {
                    console.error("Error fetching performance data:", error);
                });
        }
    }, [selectedStudent]);

    // Render or update the chart
    useEffect(() => {
        if (chartRef.current && performanceData.length > 0) {
            // Destroy existing chart if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext("2d");
            chartInstance.current = new Chart(ctx, {
                type: "line",
                data: {
                    labels: ["Quiz 1", "Quiz 2", "Quiz 3", "Assignment 1", "Assignment 2"],
                    datasets: [
                        {
                            label: "Performance",
                            data: performanceData,
                            borderColor: "teal",
                            backgroundColor: "rgba(0, 128, 128, 0.2)",
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }

        // Cleanup function to destroy chart instance when component unmounts or when re-rendered
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null; // Reset chart instance to null
            }
        };
    }, [performanceData]);

    return (
        <div>
            <h3>Performance Chart</h3>

            {/* Dropdown for selecting a student */}
            <select
                onChange={(e) => setSelectedStudent(e.target.value)}
                value={selectedStudent || ""}
                className="p-2 border rounded"
            >
                <option value="" disabled>
                    Select a Student
                </option>
                {students.map((student) => (
                    <option key={student.student_id} value={student.student_id}>
                        {student.name}
                    </option>
                ))}
            </select>

            {/* Chart canvas */}
            <div className="mt-4">
                <canvas ref={chartRef} id="performanceChart"></canvas>
            </div>
        </div>
    );
};

export default PerformanceChart;