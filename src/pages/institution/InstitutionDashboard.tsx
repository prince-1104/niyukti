import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Building2, Briefcase, TrendingUp, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { InstitutionProfile, Job, Subscription } from '../../types';

export default function InstitutionDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [profile, setProfile] = useState<InstitutionProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileData, jobsData, subscriptionData] = await Promise.all([
        api.getInstitutionProfile().catch(() => null),
        api.listJobs().catch(() => []),
        api.getSubscription().catch(() => null),
      ]);
      setProfile(profileData);
      setJobs(jobsData);
      setSubscription(subscriptionData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const jobStatsData = [
    { month: 'Jan', active: 5, draft: 2 },
    { month: 'Feb', active: 8, draft: 3 },
    { month: 'Mar', active: 12, draft: 4 },
    { month: 'Apr', active: 15, draft: 5 },
    { month: 'May', active: 18, draft: 6 },
    { month: 'Jun', active: 22, draft: 7 },
  ];

  const candidateData = [
    { subject: 'Maths', candidates: 45 },
    { subject: 'Science', candidates: 32 },
    { subject: 'English', candidates: 28 },
    { subject: 'Social', candidates: 19 },
  ];

  if (loading) {
    return <div className="text-center py-12 text-gray-300">Loading...</div>;
  }

  const activeJobs = jobs.filter((j) => j.status === 'active').length;
  const draftJobs = jobs.filter((j) => j.status === 'draft').length;
  const isProfileComplete = profile?.is_profile_complete;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome, {profile?.name || user?.full_name}!</h1>
          <p className="text-gray-400">Manage your institution and job postings</p>
        </div>
        <Link to="/institution/jobs/create" className="bg-gradient-to-r from-dashboard-green to-dashboard-blue text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Job
        </Link>
      </div>

      {!isProfileComplete && (
        <div className="bg-dashboard-orange/20 border border-dashboard-orange/50 rounded-xl p-4">
          <p className="text-dashboard-orange">
            <strong>Complete your institution profile</strong> to start posting jobs!
          </p>
          <Link to="/institution/profile" className="text-dashboard-orange/80 underline mt-2 inline-block hover:text-dashboard-orange">
            Go to Profile →
          </Link>
        </div>
      )}

      {subscription && (
        <div className={`${theme === 'light' ? 'bg-indigo-600' : 'bg-dashboard-card'} rounded-xl shadow-xl p-6 border-2 ${
          subscription.tier === 'paid' 
            ? theme === 'light' 
              ? 'border-indigo-700 bg-indigo-700/30' 
              : 'border-dashboard-green bg-dashboard-green/10' 
            : theme === 'light'
              ? 'border-indigo-700'
              : 'border-dashboard-green/30'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'light' ? 'text-black' : 'text-gray-400'}`}>Subscription</p>
              <p className={`text-2xl font-bold capitalize ${theme === 'light' ? 'text-black' : 'text-white'}`}>{subscription.tier} Plan</p>
              {subscription.tier === 'free' && (
                <p className={`text-sm ${theme === 'light' ? 'text-black' : 'text-gray-400'} mt-1`}>
                  Upgrade to view candidate scores and details
                </p>
              )}
            </div>
            {subscription.tier === 'free' && (
              <button className="bg-gradient-to-r from-dashboard-green to-dashboard-blue text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
                Upgrade
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${theme === 'light' ? 'bg-indigo-600' : 'bg-dashboard-card'} rounded-xl shadow-xl p-6 border ${theme === 'light' ? 'border-indigo-700' : 'border-dashboard-green/20'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'light' ? 'text-indigo-100' : 'text-gray-400'}`}>Active Jobs</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'light' ? 'text-white' : 'text-white'}`}>{activeJobs}</p>
            </div>
            <Briefcase className="w-12 h-12 text-dashboard-green" />
          </div>
          <Link
            to="/institution/jobs"
            className="text-dashboard-green hover:text-dashboard-green/80 text-sm font-medium mt-4 inline-block"
          >
            View All Jobs →
          </Link>
        </div>

        <div className={`${theme === 'light' ? 'bg-indigo-600' : 'bg-dashboard-card'} rounded-xl shadow-xl p-6 border ${theme === 'light' ? 'border-indigo-700' : 'border-dashboard-green/20'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'light' ? 'text-black' : 'text-gray-400'}`}>Draft Jobs</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'light' ? 'text-black' : 'text-white'}`}>{draftJobs}</p>
            </div>
            <Building2 className="w-12 h-12 text-dashboard-orange" />
          </div>
          <Link
            to="/institution/jobs"
            className="text-dashboard-green hover:text-dashboard-green/80 text-sm font-medium mt-4 inline-block"
          >
            View Drafts →
          </Link>
        </div>

        <div className={`${theme === 'light' ? 'bg-indigo-600' : 'bg-dashboard-card'} rounded-xl shadow-xl p-6 border ${theme === 'light' ? 'border-indigo-700' : 'border-dashboard-green/20'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'light' ? 'text-black' : 'text-gray-400'}`}>Total Jobs</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'light' ? 'text-black' : 'text-white'}`}>{jobs.length}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-dashboard-blue" />
          </div>
          <Link
            to="/institution/jobs"
            className="text-dashboard-green hover:text-dashboard-green/80 text-sm font-medium mt-4 inline-block"
          >
            Manage Jobs →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${theme === 'light' ? 'bg-indigo-600' : 'bg-dashboard-card'} rounded-xl shadow-xl p-6 border ${theme === 'light' ? 'border-indigo-700' : 'border-dashboard-green/20'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Job Statistics</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={jobStatsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="active" fill="#00ff88" radius={[8, 8, 0, 0]} />
              <Bar dataKey="draft" fill="#ff6b35" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`${theme === 'light' ? 'bg-indigo-600' : 'bg-dashboard-card'} rounded-xl shadow-xl p-6 border ${theme === 'light' ? 'border-indigo-700' : 'border-dashboard-green/20'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Candidates by Subject</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={candidateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="subject" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="candidates" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {jobs.length > 0 && (
        <div className={`${theme === 'light' ? 'bg-indigo-600' : 'bg-dashboard-card'} rounded-xl shadow-xl p-6 border ${theme === 'light' ? 'border-indigo-700' : 'border-dashboard-green/20'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-black' : 'text-white'}`}>Recent Jobs</h2>
            <Link to="/institution/jobs" className="text-dashboard-green hover:text-dashboard-green/80 text-sm">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <Link
                key={job.id}
                to={`/institution/jobs/${job.id}`}
                className="flex items-center justify-between p-3 border border-dashboard-green/30 rounded-lg hover:border-dashboard-green hover:bg-dashboard-card transition-colors"
              >
                <div>
                  <h3 className={`font-medium ${theme === 'light' ? 'text-black' : 'text-white'}`}>{job.title}</h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>
                    {job.city}, {job.state} • {job.subject.replace('_', ' ')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.status === 'active'
                    ? 'bg-dashboard-green/20 text-dashboard-green border border-dashboard-green/30'
                    : job.status === 'draft'
                    ? 'bg-dashboard-orange/20 text-dashboard-orange border border-dashboard-orange/30'
                    : 'bg-gray-700 text-gray-300 border border-gray-500/30'
                }`}>
                  {job.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
