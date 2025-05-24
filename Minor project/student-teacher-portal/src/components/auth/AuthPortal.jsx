import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { BookOpen, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AuthPortal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    studentId: '',
    department: ''
  });
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginEndpoint =
      userType === 'teacher'
        ? 'http://127.0.0.1:5000/api/teacher/login'
        : 'http://127.0.0.1:5000/api/student/login';

    const payload =
      userType === 'teacher'
        ? { name: formData.email, password: formData.password }
        : { name: formData.email, studentId: formData.studentId };

    try {
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // ✅ Save token locally
        localStorage.setItem('userId', userType === 'student' ? formData.studentId : data.teacherId); // ✅ Save userId locally

        // ✅ Save user details to context
        login({
          isAuthenticated: true,
          userType,
          token: data.token,
          userId: userType === 'student' ? formData.studentId : data.teacherId, // ✅ Important!
          userDetails: data,
        });
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg">
        <CardHeader className="space-y-1 p-6">
          <div className="flex items-center justify-center mb-4">
            {userType === 'student' ?
              <GraduationCap className="h-12 w-12 text-green-600" /> :
              <BookOpen className="h-12 w-12 text-green-600" />
            }
          </div>
          <CardTitle className="text-2xl text-center text-green-800 font-bold">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs
            defaultValue="student"
            className="w-full"
            onValueChange={setUserType}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="student" className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-t-lg">Student</TabsTrigger>
              <TabsTrigger value="teacher" className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-t-lg">Teacher</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="space-y-2">
                <Input
                  name="email"
                  type="text"
                  placeholder="Name"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring focus:ring-green-400"
                />
              </div>

              {userType === 'student' && (
                <div className="space-y-2">
                  <Input
                    name="studentId"
                    type="text"
                    placeholder="Student ID"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring focus:ring-green-400"
                  />
                </div>
              )}

              {userType === 'teacher' && (
                <div className="space-y-2">
                  <Input
                    name="password"
                    type="text"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring focus:ring-green-400"
                  />
                </div>
              )}

              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg">
                {isLogin ? 'Login' : 'Register'}
              </Button>

              <div className="text-center text-sm">
                <span className="text-green-600">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  type="button"
                  className="text-green-600 hover:underline"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Register' : 'Login'}
                </button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPortal;