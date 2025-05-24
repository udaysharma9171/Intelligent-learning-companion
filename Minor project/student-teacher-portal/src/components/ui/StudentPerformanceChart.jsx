import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const StudentPerformanceChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      
      // Destroy previous chart instance if it exists
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      // Create a new chart instance
      chartRef.current.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Quiz 1", "Quiz 2", "Quiz 3", "Assignment 1", "Assignment 2"],
          datasets: [
            {
              label: "Performance (%)",
              data: data,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Percentage (%)",
              },
            },
            x: {
              title: {
                display: true,
                text: "Evaluations",
              },
            },
          },
        },
      });
    }
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default StudentPerformanceChart;

