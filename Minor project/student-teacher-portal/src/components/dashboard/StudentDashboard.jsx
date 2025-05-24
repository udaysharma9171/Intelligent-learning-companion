import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { BookOpen, Clock, Award } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Recommendations from "../ui/Recommendations";
import StudentPerformance from "./StudentPerformance";

const StudentDashboard = () => {
  const { user, logout } = useAuth();

  // Generate random values on component mount
  const [pendingAssignments, setPendingAssignments] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  // Sample data - In real app, this would come from API
  const assignments = [
    {
      id: 1,
      title: "Math Quiz 1",
      dueDate: "2024-11-30",
      status: "pending",
      subject: "Mathematics",
      score: null,
    },
    {
      id: 2,
      title: "Physics Lab Report",
      dueDate: "2024-11-28",
      status: "submitted",
      subject: "Physics",
      score: 85,
    },
    {
      id: 3,
      title: "Literature Essay",
      dueDate: "2024-11-25",
      status: "graded",
      subject: "English",
      score: 92,
    },
  ];

  useEffect(() => {
    // Function to generate a random integer within a range
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Randomize the values
    setPendingAssignments(getRandomInt(1, 5));
    setAverageScore(getRandomInt(70, 100));
    setCompletedTasks(getRandomInt(5, 15));
  }, []); 

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-green-50">
      {/* Header Section */}
      <div className="flex justify-between items-center animate-fade-in-down">
        <h1 className="text-3xl font-bold text-green-800">Welcome back, Student!</h1>
        <button 
            onClick={logout} 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
          >
            Logout
          </button>
      </div>

       {/* Quick Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: <Clock className="h-8 w-8 text-green-500 mr-4" />, 
            label: "Pending Assignments", 
            value: pendingAssignments.toString(),
            bgClass: "hover:bg-green-100 transition-all duration-300 transform hover:scale-105"
          },
          { icon: <Award className="h-8 w-8 text-emerald-500 mr-4" />, 
            label: "Average Score", 
            value: averageScore.toString() + "%",
            bgClass: "hover:bg-emerald-100 transition-all duration-300 transform hover:scale-105"
          },
          { icon: <BookOpen className="h-8 w-8 text-lime-500 mr-4" />, 
            label: "Completed Tasks", 
            value: completedTasks.toString(),
            bgClass: "hover:bg-lime-100 transition-all duration-300 transform hover:scale-105"
          }
        ].map((stat, index) => (
          <Card key={index} className={`${stat.bgClass} shadow-md`}>
            <CardContent className="flex items-center p-6">
              {stat.icon}
              <div>
                <p className="text-sm text-green-700">{stat.label}</p>
                <p className="text-2xl font-bold text-green-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="assignments" className="space-y-4">
        <TabsList className="bg-green-100">
          <TabsTrigger 
            value="assignments" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Assignments
          </TabsTrigger>
          <TabsTrigger 
            value="recommendations"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Recommendations
          </TabsTrigger>
          <TabsTrigger 
            value="performance"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <Card className="border-green-200 bg-white">
            <CardHeader>
              <CardTitle className="text-green-800">Current Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 border-b border-green-100 last:border-b-0 hover:bg-green-50 transition-colors duration-300"
                  >
                    <div>
                      <h3 className="font-medium text-green-900">{assignment.title}</h3>
                      <p className="text-sm text-green-600">{assignment.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-700">Due: {assignment.dueDate}</p>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          assignment.status === "graded"
                            ? "bg-green-100 text-green-800"
                            : assignment.status === "submitted"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-lime-100 text-lime-800"
                        }`}
                      >
                        {assignment.status.charAt(0).toUpperCase() +
                          assignment.status.slice(1)}
                      </span>
                      {assignment.score && (
                        <p className="mt-1 font-medium text-green-900">{assignment.score}%</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card className="border-green-200 bg-white">
            <CardHeader>
              <CardTitle className="text-green-800">Recommended Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <Recommendations />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="border-green-200 bg-white">
            <CardHeader>
              <CardTitle className="text-green-800">Performance Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentPerformance />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;