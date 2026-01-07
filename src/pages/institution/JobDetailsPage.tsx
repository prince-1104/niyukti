import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Sparkles, Users, AlertCircle, TrendingUp, MapPin, BookOpen, Briefcase, Rocket } from 'lucide-react';
import type { Job } from '../../types';

export default function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(false);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  const loadJob = async () => {
    try {
      const data = await api.getJob(Number(jobId));
      setJob(data);
    } catch (error) {
      console.error('Failed to load job:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDiagnostics = async () => {
    if (!jobId) return;
    setLoadingDiagnostics(true);
    try {
      const data = await api.getJobMatchingDiagnostics(Number(jobId));
      setDiagnostics(data);
    } catch (error) {
      console.error('Failed to load diagnostics:', error);
    } finally {
      setLoadingDiagnostics(false);
    }
  };

  useEffect(() => {
    if (jobId && job) {
      loadDiagnostics();
    }
  }, [jobId, job]);

  const handleGenerateQuestions = async () => {
    if (!jobId) return;

    setGenerating(true);
    setMessage(null);
    try {
      await api.generateQuestions(Number(jobId));
      setMessage('Questions generated successfully!');
      await loadJob();
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to generate questions');
    } finally {
      setGenerating(false);
    }
  };

  const handleActivate = async () => {
    if (!jobId) return;
    setActivating(true);
    setMessage(null);
    try {
      await api.activateJob(Number(jobId));
      setMessage('Job activated successfully!');
      await loadJob();
      await loadDiagnostics();
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to activate job');
    } finally {
      setActivating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-300">Loading...</div>;
  }

  if (!job) {
    return <div className="text-center py-12 text-gray-300">Job not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">{job.title}</h1>
          <p className="text-gray-300 mt-2">
            {job.city}, {job.state} • {job.subject.replace('_', ' ')}
          </p>
        </div>
        <Link
          to="/institution/jobs"
          className="btn-secondary"
        >
          Back to Jobs
        </Link>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes('success')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Job Information</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-600">Role</dt>
              <dd className="text-gray-900">{job.role}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Subject</dt>
              <dd className="text-gray-900 capitalize">{job.subject.replace('_', ' ')}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Location</dt>
              <dd className="text-gray-900">{job.city}, {job.state}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Status</dt>
              <dd>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : job.status === 'draft'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {job.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Requirements</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-600">Experience</dt>
              <dd className="text-gray-900">
                {job.required_experience_years} years
                {job.required_experience_level && ` (${job.required_experience_level})`}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Max Distance</dt>
              <dd className="text-gray-100">{job.max_distance_km} km</dd>
            </div>
          </dl>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Screening Configuration</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-400">Questions</dt>
              <dd className="text-gray-100">{job.screening_question_count}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Passing Threshold</dt>
              <dd className="text-gray-100">{job.passing_score_threshold}%</dd>
            </div>
          </dl>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Actions</h2>
          <div className="space-y-3">
            {job.status === 'draft' && (
              <button
                onClick={handleActivate}
                disabled={activating}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                {activating ? 'Activating...' : 'Activate Job'}
              </button>
            )}
            <button
              onClick={handleGenerateQuestions}
              disabled={generating}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {generating ? 'Generating...' : 'Generate Questions'}
            </button>
            <Link
              to={`/institution/jobs/${job.id}/candidates`}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              View Candidates
            </Link>
          </div>
        </div>

        {/* Matching Diagnostics */}
        {diagnostics && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                Matching Diagnostics
              </h2>
              <button
                onClick={loadDiagnostics}
                disabled={loadingDiagnostics}
                className="text-sm text-primary-400 hover:text-primary-300"
              >
                {loadingDiagnostics ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {!diagnostics.is_active ? (
              <div className="bg-yellow-900/30 border-2 border-yellow-500/50 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 font-medium mb-1">Job is in Draft Status</p>
                    <p className="text-yellow-200 text-sm">
                      Activate this job to make it visible to candidates. Currently, only active jobs appear in candidate searches.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-primary-900/40 to-purple-900/40 p-4 rounded-lg border border-primary-500/30">
                    <div className="text-sm text-gray-400 mb-1">Total Candidates</div>
                    <div className="text-2xl font-bold text-gray-100">{diagnostics.total_candidates}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 p-4 rounded-lg border border-green-500/30">
                    <div className="text-sm text-gray-400 mb-1">Matching Candidates</div>
                    <div className="text-2xl font-bold text-green-300">{diagnostics.matching_candidates_count}</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-4 rounded-lg border border-blue-500/30">
                    <div className="text-sm text-gray-400 mb-1">Match Rate</div>
                    <div className="text-2xl font-bold text-blue-300">
                      {diagnostics.total_candidates > 0
                        ? Math.round((diagnostics.matching_candidates_count / diagnostics.total_candidates) * 100)
                        : 0}%
                    </div>
                  </div>
                </div>

                {diagnostics.matching_candidates_count > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Top Matching Candidates</h3>
                    <div className="space-y-2">
                      {diagnostics.matching_candidates.slice(0, 5).map((match: any, idx: number) => (
                        <div key={idx} className="bg-gray-800/50 p-3 rounded-lg border border-purple-500/30 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-300 font-semibold">
                              {idx + 1}
                            </div>
                            <div>
                              <div className="text-gray-200 font-medium">Candidate #{match.candidate_id}</div>
                              {match.distance_km !== null && (
                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {match.distance_km.toFixed(1)} km away
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-green-400">{match.match_score.toFixed(0)}%</div>
                            <div className="text-xs text-gray-400">Match</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {diagnostics.non_matching_reasons_summary && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Why Candidates Don't Match</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {diagnostics.non_matching_reasons_summary.location > 0 && (
                        <div className="bg-red-900/30 p-3 rounded-lg border border-red-500/30">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-red-400" />
                            <span className="text-sm font-medium text-red-300">Location</span>
                          </div>
                          <div className="text-lg font-bold text-red-200">{diagnostics.non_matching_reasons_summary.location}</div>
                          <div className="text-xs text-red-300">candidates</div>
                        </div>
                      )}
                      {diagnostics.non_matching_reasons_summary.subject > 0 && (
                        <div className="bg-orange-900/30 p-3 rounded-lg border border-orange-500/30">
                          <div className="flex items-center gap-2 mb-1">
                            <BookOpen className="w-4 h-4 text-orange-400" />
                            <span className="text-sm font-medium text-orange-300">Subject</span>
                          </div>
                          <div className="text-lg font-bold text-orange-200">{diagnostics.non_matching_reasons_summary.subject}</div>
                          <div className="text-xs text-orange-300">candidates</div>
                        </div>
                      )}
                      {diagnostics.non_matching_reasons_summary.experience > 0 && (
                        <div className="bg-purple-900/30 p-3 rounded-lg border border-purple-500/30">
                          <div className="flex items-center gap-2 mb-1">
                            <Briefcase className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-medium text-purple-300">Experience</span>
                          </div>
                          <div className="text-lg font-bold text-purple-200">{diagnostics.non_matching_reasons_summary.experience}</div>
                          <div className="text-xs text-purple-300">candidates</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-sm text-blue-200">{diagnostics.message}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

