import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PerformanceDistributionChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/teacher/performance-distribution')
      .then(response => response.json())
      .then(data => {
        setChartData({
          labels: ['High Achievers', 'Average', 'At Risk'],
          datasets: [
            {
              label: 'Student Count',
              data: [data['High Achievers'], data['Average'], data['At Risk']],
              backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
              borderColor: ['#fff', '#fff', '#fff'],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(error => {
        console.error("Error fetching performance distribution:", error);
      });
  }, []);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div className="w-full md:w-1/2 p-4">
      <h2 className="text-xl font-semibold mb-2 text-center">📊 Performance Distribution</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default PerformanceDistributionChart;