import React, { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { CalendarCheck } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GenerateReport = () => {
  const [attendanceStats, setAttendanceStats] = useState({ labels: [], data: [] });
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const facultyId = localStorage.getItem("facultyId");
        const res = await fetch(`/api/attendanceRoute/approved/${facultyId}`);
        const data = await res.json();

        // Save raw data
        setAttendances(Array.isArray(data) ? data : []);

        // Process data for chart
        const monthlyCounts = {};
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        data.forEach(att => {
          const date = new Date(att.date);
          if (!isNaN(date)) {
            const month = monthNames[date.getMonth()];
            monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
          }
        });

        const labels = monthNames;
        const chartData = labels.map(month => monthlyCounts[month] || 0);

        setAttendanceStats({ labels, data: chartData });
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setAttendances([]);
      }
    };

    fetchAttendance();
  }, []);

  const attendanceChartData = {
    labels: attendanceStats.labels,
    datasets: [
      {
        label: 'Approved Attendance Count',
        data: attendanceStats.data,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
      },
    ],
  };

  const totalApproved = attendances.length;

  return (
    <div className="p-6 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 dark:text-gray-100 font-serif">
          Attendance Report Dashboard
        </h1>

        {/* ✅ Total Attendance Stat Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="hover:shadow-lg transition-shadow rounded-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Approved Attendance</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{totalApproved}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <CalendarCheck size={28} />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* 📈 Attendance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="h-full">
              <div className="flex items-center mb-4">
                <CalendarCheck className="w-8 h-8 mr-2 text-blue-600 bg-gray-400 p-1 rounded-full" />
                <h2 className="text-xl font-semibold text-gray-800">Approved Attendance Over Months</h2>
              </div>
              <div className="h-80">
                <Line
                  data={attendanceChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                    },
                  }}
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GenerateReport;
