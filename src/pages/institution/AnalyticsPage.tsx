import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Briefcase, Calendar } from 'lucide-react';

const COLORS = {
  green: '#4ade80',
  purple: '#a855f7',
  gray: '#6b7280',
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const salesData = [
    { month: 'Sep', visitors: 1800, applications: 1200 },
    { month: 'Oct', visitors: 2100, applications: 1500 },
    { month: 'Nov', visitors: 2025, applications: 1400 },
  ];

  const candidateData = [
    { subject: 'Maths', count: 45 },
    { subject: 'Science', count: 32 },
    { subject: 'English', count: 28 },
    { subject: 'Social', count: 19 },
  ];

  const pieData = [
    { name: 'Active', value: 65 },
    { name: 'Draft', value: 25 },
    { name: 'Closed', value: 10 },
  ];

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-analytics-gray p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-analytics-dark mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Updated 1 day ago</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Visitors</p>
                <p className="text-3xl font-bold text-analytics-dark mt-1">2,025</p>
                <div className="flex items-center mt-2 text-analytics-green">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">+12.5%</span>
                </div>
              </div>
              <Users className="w-12 h-12 text-analytics-green" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Applications</p>
                <p className="text-3xl font-bold text-analytics-dark mt-1">1,402</p>
                <div className="flex items-center mt-2 text-analytics-green">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">+8.3%</span>
                </div>
              </div>
              <Briefcase className="w-12 h-12 text-analytics-purple" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-analytics-dark mt-1">24</p>
                <div className="flex items-center mt-2 text-gray-600">
                  <span className="text-sm">No change</span>
                </div>
              </div>
              <Calendar className="w-12 h-12 text-analytics-purple" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-analytics-dark mt-1">69.2%</p>
                <div className="flex items-center mt-2 text-analytics-green">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">+2.1%</span>
                </div>
              </div>
              <TrendingUp className="w-12 h-12 text-analytics-green" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-analytics-dark">Sales Statistics</h2>
              <select className="text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-1">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Yearly</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  labelStyle={{ color: '#1f2937' }}
                />
                <Legend />
                <Bar dataKey="visitors" fill={COLORS.green} radius={[8, 8, 0, 0]} />
                <Bar dataKey="applications" fill={COLORS.purple} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-analytics-dark mb-4">Candidate Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={[COLORS.green, COLORS.purple, COLORS.gray][index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-analytics-dark mb-4">Application Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                labelStyle={{ color: '#1f2937' }}
              />
              <Legend />
              <Line type="monotone" dataKey="visitors" stroke={COLORS.green} strokeWidth={3} />
              <Line type="monotone" dataKey="applications" stroke={COLORS.purple} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-analytics-dark mb-4">Candidates by Subject</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={candidateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="subject" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                labelStyle={{ color: '#1f2937' }}
              />
              <Bar dataKey="count" fill={COLORS.green} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

