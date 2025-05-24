import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { TabsContent } from "../../components/ui/tabs";
import { useAuth } from "../../contexts/AuthContext";

const Recommendations = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [recommendedResources, setRecommendedResources] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = user?.userId || localStorage.getItem('userId');

        if (!userId) {
          console.error("No userId found");
          return;
        }

        // ✅ Fetch the student data
        const studentResponse = await fetch(`/api/students/${userId}`);
        const studentData = await studentResponse.json();

        // ✅ Fetch the list of all resources
        const resourcesResponse = await fetch("/resources");
        const allResources = await resourcesResponse.json();

        // ✅ Filter the resources based on the student's cluster
        const filteredResources = allResources.resources.filter(
          (resource) => resource.category === `Cluster ${studentData.student.cluster}`
        );

        setResources(allResources.resources);
        setRecommendedResources(filteredResources);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <TabsContent value="recommendations">
      <Card>
        <CardHeader>
          <CardTitle>Recommended Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recommendedResources.length > 0 ? (
              recommendedResources.map((resource, index) => (
                <div key={index}>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    {resource.title} ({resource.type})
                  </a>
                </div>
              ))
            ) : (
              <p>No recommendations available for your cluster at the moment.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Recommendations;