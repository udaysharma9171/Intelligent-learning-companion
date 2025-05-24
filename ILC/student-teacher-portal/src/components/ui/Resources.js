import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Resources = () => {
    const [resources, setResources] = useState([]); // Ensure resources is initialized as an array

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/resources');
                console.log('API Response:', response.data); // Log the response to verify its structure
                
                // Ensure the data is an array
                if (response.data && Array.isArray(response.data.resources)) {
                    setResources(response.data.resources); // Access the "resources" array in the response
                } else {
                    console.error('Unexpected API response structure:', response.data);
                }
            } catch (error) {
                console.error('Error fetching resources:', error);
            }
        };

        fetchResources();
    }, []);

    const fetchResourcesByCategory = async (category) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/resources/${category}`);
            console.log('Resources for category:', category, response.data);
        } catch (error) {
            console.error('Error fetching resources by category:', error);
        }
    };

    // Example Usage
    useEffect(() => {
        fetchResourcesByCategory('Cluster 0'); // Fetch specific category on load for testing
    }, []);

    return (
        <div>
            <h3>All Resources</h3>
            <ul>
                {Array.isArray(resources) ? (
                    resources.map((resource, index) => (
                        <li key={index}>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                {resource.title} ({resource.type})
                            </a>
                        </li>
                    ))
                ) : (
                    <p>Loading resources...</p>
                )}
            </ul>
        </div>
    );
};

export default Resources;