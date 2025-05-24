import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { BookOpen, Users, CheckCircle } from "lucide-react";
import PerformanceChart from "../ui/PerformanceChart";
import PerformanceDistributionChart from "../ui/PerformanceDistributionChart";
import AddResourceForm from "../ui/AddResourceForm";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();

  // ✅ State for Resource Upload Form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const resourceData = { title, category, url, type };

    try {
      const response = await fetch("http://127.0.0.1:5000/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resourceData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Resource added successfully!");
        // Clear form
        setTitle("");
        setCategory("");
        setUrl("");
        setType("");
      } else {
        setMessage(` Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error adding resource:", error);
      setMessage(" Failed to add resource.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-green-50">
      {/* Header Section */}
      <div className="flex justify-between items-center animate-fade-in-down">
        <h1 className="text-3xl font-bold text-green-800">
          Welcome, {user?.fullName || "Teacher"}!
        </h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-green-600">
            {user?.department || "Department Not Specified"}
          </div>
          <button
            onClick={logout}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: <Users className="h-8 w-8 text-green-500 mr-4" />,
            label: "Total Students",
            value: "50",
            bgClass:
              "hover:bg-green-100 transition-all duration-300 transform hover:scale-105",
          },
          {
            icon: <BookOpen className="h-8 w-8 text-emerald-500 mr-4" />,
            label: "Active Courses",
            value: "5",
            bgClass:
              "hover:bg-emerald-100 transition-all duration-300 transform hover:scale-105",
          },
          {
            icon: <CheckCircle className="h-8 w-8 text-lime-500 mr-4" />,
            label: "Assignments Graded",
            value: "120",
            bgClass:
              "hover:bg-lime-100 transition-all duration-300 transform hover:scale-105",
          },
        ].map((stat, index) => (
          <Card key={index} className={`${stat.bgClass} shadow-md`}>
            <CardContent className="flex items-center p-6">
              {stat.icon}
              <div>
                <p className="text-sm text-green-700">{stat.label}</p>
                <p className="text-2xl font-bold text-green-900">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Assignments */}
        <Card className="border-green-200 bg-white hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-green-800">
              Upcoming Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Math Quiz",
                  dueDate: "2024-12-15",
                  subject: "Mathematics",
                },
                {
                  title: "Science Project",
                  dueDate: "2024-12-20",
                  subject: "Science",
                },
                {
                  title: "Literature Essay",
                  dueDate: "2024-12-25",
                  subject: "English",
                },
              ].map((assignment, index) => (
                <div
                  key={index}
                  className="border-b border-green-100 pb-2 last:border-b-0 hover:bg-green-50 transition-colors duration-300 rounded-lg"
                >
                  <div className="flex justify-between p-2">
                    <div>
                      <p className="font-medium text-green-900">
                        {assignment.title}
                      </p>
                      <p className="text-sm text-green-600">
                        {assignment.subject}
                      </p>
                    </div>
                    <span className="text-sm text-green-700">
                      Due: {assignment.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-green-200 bg-white hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-green-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Graded Math Quiz",
                  student: "John Doe",
                  time: "2 hours ago",
                },
                {
                  action: "Assigned Science Project",
                  student: "Class 10-A",
                  time: "5 hours ago",
                },
                {
                  action: "Updated Course Materials",
                  student: "All Students",
                  time: "1 day ago",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="border-b border-green-100 pb-2 last:border-b-0 hover:bg-green-50 transition-colors duration-300 rounded-lg"
                >
                  <p className="font-medium text-green-900 p-2">
                    {activity.action}
                  </p>
                  <div className="flex justify-between text-sm text-green-600 px-2">
                    <span>{activity.student}</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="mt-6 border-green-200 bg-white hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-green-800">Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <PerformanceChart />
        </CardContent>
      </Card>

      {/* Performance Distribution */}
      <Card className="mt-6 border-green-200 bg-white hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-green-800">
            Performance Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PerformanceDistributionChart />
        </CardContent>
      </Card>

      {/* ✅ Add Resource Form */}
      <Card className="mt-6 border-green-200 bg-white hover:shadow-lg transition-shadow duration-300">
        <CardContent>
          <AddResourceForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
