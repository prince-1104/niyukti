import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Briefcase, TrendingUp, CheckCircle, Lock, Shield } from 'lucide-react';
import type { JobMatch, JobMatchCount } from '../../types';

function ApplyButton({ jobId }: { jobId: number }) {
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    setApplying(true);
    try {
      const attempt = await api.startScreening({ job_id: jobId });
      navigate(`/candidate/screening/${attempt.id}`);
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to start screening');
    } finally {
      setApplying(false);
    }
  };

  return (
    <button
      onClick={handleApply}
      disabled={applying}
      className="btn-primary flex items-center gap-2"
    >
      {applying ? 'Starting...' : (
        <>
          <Shield className="w-4 h-4" />
          Start Screening
        </>
      )}
    </button>
  );
}

export default function CandidateJobs() {
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [jobCount, setJobCount] = useState<JobMatchCount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsData, countData] = await Promise.all([
        api.findMatchingJobs(),
        api.getJobMatchCount(),
      ]);
      setJobs(jobsData);
      setJobCount(countData);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-300">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Matching Opportunities</h1>
        {jobCount && (
          <p className="text-gray-300 mt-2 text-lg">{jobCount.message}</p>
        )}
        <div className="mt-4 bg-blue-900/30 border-2 border-blue-500/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-300 font-medium mb-1">Privacy Protected</p>
              <p className="text-blue-200 text-sm">
                Job details are kept confidential until after you complete the screening process. 
                This ensures fair evaluation for all candidates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="card text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-100 mb-2">No matching opportunities found</h2>
          <p className="text-gray-400">
            Update your profile preferences to see more job opportunities.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job, index) => (
            <div key={job.job_id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      #{index + 1}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-100">Matching Opportunity</h2>
                      {job.already_applied && (
                        <span className="flex items-center gap-1 text-sm text-green-400 mt-1">
                          <CheckCircle className="w-4 h-4" />
                          Screening Completed
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-500/30 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-lg font-bold text-green-400">
                        {job.match_score.toFixed(0)}% Match
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      This opportunity matches your profile preferences. Complete the screening to learn more.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>Details revealed after screening</span>
                  </div>
                </div>

                <div className="ml-4">
                  {!job.already_applied ? (
                    <ApplyButton jobId={job.job_id} />
                  ) : (
                    <div className="bg-green-900/30 border-2 border-green-500/50 rounded-lg px-4 py-2 text-center">
                      <p className="text-green-300 text-sm font-medium">Completed</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

