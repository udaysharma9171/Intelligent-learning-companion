import React, { useState, useEffect } from 'react';

const AddResourceForm = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [resources, setResources] = useState([]);

  // ✅ Fetch all resources
  const fetchResources = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/resources');
      const data = await response.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // ✅ Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, url, type }),
      });

      if (response.ok) {
        setMessage('Resource added successfully!');
        // Clear form
        setTitle('');
        setCategory('');
        setUrl('');
        setType('');
        fetchResources(); // ✅ Refresh resource list
      } else {
        setMessage('Failed to add resource.');
      }
    } catch (error) {
      console.error('Error adding resource:', error);
      setMessage('Error adding resource.');
    }
  };

  // ✅ Handle Delete Resource
  const handleDelete = async (title) => {
    const token = localStorage.getItem('token'); // ✅ Get token from localStorage
    console.log('Delete Token:', token); // ✅ Debugging
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/resources/${encodeURIComponent(title)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // ✅ Fixed Bearer formatting
        },
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to delete resource');
      }
  
      console.log('Resource deleted successfully');
      setResources(resources.filter(resource => resource.title !== title)); // ✅ Update frontend state
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };
  
  return (
    <div className="mt-6 border-green-200 bg-white hover:shadow-lg transition-shadow duration-300 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Add New Resource</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-green-300 p-2 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-green-300 p-2 rounded w-full"
          required
        />
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border border-green-300 p-2 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Type (e.g., PDF, Video)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-green-300 p-2 rounded w-full"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300"
        >
          Add Resource
        </button>
      </form>

      {/* ✅ Display existing resources */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-green-800 mb-3">Existing Resources</h3>
        {resources.length > 0 ? (
          <ul className="space-y-2">
            {resources.map((resource, index) => (
              <li
                key={index}
                className="border border-green-200 p-3 rounded flex justify-between items-center hover:bg-green-50 transition"
              >
                <div>
                  <p className="font-medium">{resource.title}</p>
                  <p className="text-sm text-green-700">{resource.category} | {resource.type}</p>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-green-600 underline text-sm">
                    View Resource
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(resource.title)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-green-700">No resources available.</p>
        )}
      </div>
    </div>
  );
};

export default AddResourceForm;