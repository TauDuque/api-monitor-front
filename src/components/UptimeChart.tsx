// src/components/UptimeChart.tsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface UptimeChartProps {
  data: { period_start: string; uptime_percentage: number }[];
  title: string;
}

const UptimeChart: React.FC<UptimeChartProps> = ({ data, title }) => {
  const chartData = {
    labels: data.map((d) => new Date(d.period_start).toLocaleDateString()), // Ou formatar para hora/dia
    datasets: [
      {
        label: "Uptime (%)",
        data: data.map((d) => d.uptime_percentage),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Uptime (%)",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default UptimeChart;
