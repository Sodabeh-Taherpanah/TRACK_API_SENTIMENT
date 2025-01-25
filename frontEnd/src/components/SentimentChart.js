import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SentimentChart = ({ ticker }) => {
  const [sentiments, setSentiments] = useState([]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/sentimentA/${ticker}`)
      .then((response) => setSentiments(response.data));
  }, [ticker]);

  const chartData = {
    labels: sentiments.map((_, index) => `Row ${index + 1}`),
    datasets: [
      {
        label: "Sentiment Score",
        data: sentiments.map((item) => parseFloat(item.sentiment.score)),
        backgroundColor: sentiments.map((item) =>
          item.sentiment.label === "negative"
            ? "red"
            : "neutral"
            ? "gray"
            : "green"
        ),
        barThickness: 20, // Controls the width of the bars
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows better control of chart size
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Row Numbers",
        },
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: "Sentiment Score",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full p-4 max-w-screen-lg mx-auto">
      <div className="w-full max-w-2xl mx-auto h-80 sm:h-96 md:h-112 mb-8">
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Row
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Title
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Sentiment Label
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Sentiment Score
              </th>
            </tr>
          </thead>
          <tbody>
            {sentiments.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.sentiment.label}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {parseFloat(item.sentiment.score).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SentimentChart;
