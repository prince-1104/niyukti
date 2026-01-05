import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, Upload, UserCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CandidateProfile, JobMatchCount } from '../../types';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [jobCount, setJobCount] = useState<JobMatchCount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileData, jobCountData] = await Promise.all([
        api.getCandidateProfile().catch((err) => {
          if (err.response?.status === 404) {
            return null;
          }
          throw err;
        }),
        api.getJobMatchCount().catch((err) => {
          if (err.response?.status === 404) {
            return null;
          }
          throw err;
        }),
      ]);
      setProfile(profileData);
      setJobCount(jobCountData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Mon', applications: 12, matches: 8 },
    { name: 'Tue', applications: 19, matches: 12 },
    { name: 'Wed', applications: 15, matches: 10 },
    { name: 'Thu', applications: 22, matches: 15 },
    { name: 'Fri', applications: 18, matches: 11 },
    { name: 'Sat', applications: 10, matches: 6 },
    { name: 'Sun', applications: 8, matches: 5 },
  ];

  const subjectData = [
    { subject: 'Maths', count: 45 },
    { subject: 'Science', count: 32 },
    { subject: 'English', count: 28 },
    { subject: 'Social', count: 19 },
  ];

  if (loading) {
    return <div className="text-center py-12 text-gray-300">Loading...</div>;
  }

  const isProfileComplete = profile?.is_profile_complete;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.full_name || 'Candidate'}!</h1>
        <p className="text-gray-400">Manage your profile and find your next opportunity</p>
      </div>

      {!isProfileComplete && (
        <div className="bg-dashboard-orange/20 border border-dashboard-orange/50 rounded-xl p-4">
          <p className="text-dashboard-orange">
            <strong>Complete your profile</strong> to start finding matching jobs!
          </p>
          <Link to="/candidate/profile" className="text-dashboard-orange/80 underline mt-2 inline-block hover:text-dashboard-orange">
            Go to Profile →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dashboard-card rounded-xl shadow-xl p-6 border border-dashboard-green/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Profile Status</p>
              <p className="text-2xl font-bold mt-1 text-white">
                {isProfileComplete ? 'Complete' : 'Incomplete'}
              </p>
            </div>
            <UserCircle className="w-12 h-12 text-dashboard-blue" />
          </div>
          <Link
            to="/candidate/profile"
            className="text-dashboard-green hover:text-dashboard-green/80 text-sm font-medium mt-4 inline-block"
          >
            {isProfileComplete ? 'Update Profile' : 'Complete Profile'} →
          </Link>
        </div>

        <div className="bg-dashboard-card rounded-xl shadow-xl p-6 border border-dashboard-green/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Job Matches</p>
              <p className="text-2xl font-bold mt-1 text-white">
                {jobCount?.count ?? '--'}
              </p>
              {jobCount && (
                <p className="text-xs text-gray-400 mt-1">{jobCount.message}</p>
              )}
            </div>
            <TrendingUp className="w-12 h-12 text-dashboard-green" />
          </div>
          <Link
            to="/candidate/jobs"
            className="text-dashboard-green hover:text-dashboard-green/80 text-sm font-medium mt-4 inline-block"
          >
            View Jobs →
          </Link>
        </div>

        <div className="bg-dashboard-card rounded-xl shadow-xl p-6 border border-dashboard-green/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Resume</p>
              <p className="text-2xl font-bold mt-1 text-white">
                {profile?.is_profile_complete ? 'Uploaded' : 'Not Uploaded'}
              </p>
            </div>
            <Upload className="w-12 h-12 text-dashboard-orange" />
          </div>
          <Link
            to="/candidate/profile"
            className="text-dashboard-green hover:text-dashboard-green/80 text-sm font-medium mt-4 inline-block"
          >
            {profile?.is_profile_complete ? 'Update Resume' : 'Upload Resume'} →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dashboard-card rounded-xl shadow-xl p-6 border border-dashboard-green/20">
          <h2 className="text-xl font-semibold mb-4 text-white">Application Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="applications" stroke="#00ff88" strokeWidth={2} />
              <Line type="monotone" dataKey="matches" stroke="#ff6b35" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dashboard-card rounded-xl shadow-xl p-6 border border-dashboard-green/20">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">Subject Preferences</h2>
            <p className="text-sm text-gray-400 mt-1">Available job opportunities by subject</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="subject" 
                stroke="#9ca3af"
                label={{ value: 'Subject', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#9ca3af' } }}
              />
              <YAxis 
                stroke="#9ca3af"
                label={{ value: 'Number of Jobs', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af' } }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: number | undefined) => [`${value ?? 0} jobs`, 'Count']}
              />
              <Bar dataKey="count" fill="#00ff88" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-dashboard-card rounded-xl shadow-xl p-6 border border-dashboard-green/20">
        <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/candidate/jobs"
            className="flex items-center p-4 border-2 border-dashboard-green/30 rounded-lg hover:border-dashboard-green hover:bg-dashboard-card transition-colors"
          >
            <Briefcase className="w-6 h-6 text-dashboard-green mr-3" />
            <div>
              <div className="font-medium text-white">Find Jobs</div>
              <div className="text-sm text-gray-400">Browse matching opportunities</div>
            </div>
          </Link>
          <Link
            to="/candidate/profile"
            className="flex items-center p-4 border-2 border-dashboard-green/30 rounded-lg hover:border-dashboard-green hover:bg-dashboard-card transition-colors"
          >
            <UserCircle className="w-6 h-6 text-dashboard-green mr-3" />
            <div>
              <div className="font-medium text-white">Update Profile</div>
              <div className="text-sm text-gray-400">Manage your preferences</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
