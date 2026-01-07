import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Plus, Briefcase, Eye, CheckSquare, Square, Rocket } from 'lucide-react';
import type { Job } from '../../types';

export default function InstitutionJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [statusFilter, setStatusFilter] = useState<Job['status'] | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedJobs, setSelectedJobs] = useState<Set<number>>(new Set());
  const [activating, setActivating] = useState<number | null>(null);
  const [bulkActivating, setBulkActivating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, [statusFilter]);

  const loadJobs = async () => {
    try {
      const data = await api.listJobs(statusFilter === 'all' ? undefined : statusFilter);
      setJobs(data);
      // Clear selection when filter changes
      setSelectedJobs(new Set());
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateJob = async (jobId: number) => {
    setActivating(jobId);
    setMessage(null);
    try {
      await api.activateJob(jobId);
      setMessage('Job activated successfully!');
      await loadJobs();
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to activate job');
    } finally {
      setActivating(null);
    }
  };

  const handleBulkActivate = async () => {
    if (selectedJobs.size === 0) return;
    
    setBulkActivating(true);
    setMessage(null);
    try {
      const result = await api.bulkActivateJobs(Array.from(selectedJobs));
      setMessage(result.message);
      setSelectedJobs(new Set());
      await loadJobs();
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to activate jobs');
    } finally {
      setBulkActivating(false);
    }
  };

  const toggleJobSelection = (jobId: number) => {
    const newSelection = new Set(selectedJobs);
    if (newSelection.has(jobId)) {
      newSelection.delete(jobId);
    } else {
      newSelection.add(jobId);
    }
    setSelectedJobs(newSelection);
  };

  const toggleSelectAll = () => {
    const draftJobs = jobs.filter(j => j.status === 'draft');
    if (selectedJobs.size === draftJobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(draftJobs.map(j => j.id)));
    }
  };

  const draftJobs = jobs.filter(j => j.status === 'draft');

  if (loading) {
    return <div className="text-center py-12 text-gray-300">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Job Postings</h1>
          <p className="text-gray-300 mt-2">Manage your job postings</p>
        </div>
        <Link to="/institution/jobs/create" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Job
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-purple-500/30">
        {(['all', 'draft', 'active', 'closed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 font-medium transition-colors ${
              statusFilter === status
                ? 'border-b-2 border-primary-500 text-primary-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({status === 'all' ? jobs.length : jobs.filter((j) => j.status === status).length})
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {draftJobs.length > 0 && (
        <div className="card bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-2 border-primary-500/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-gray-300 hover:text-primary-400 transition-colors"
              >
                {selectedJobs.size === draftJobs.length ? (
                  <CheckSquare className="w-5 h-5 text-primary-400" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {selectedJobs.size === draftJobs.length ? 'Deselect All' : 'Select All Draft Jobs'}
                </span>
              </button>
              {selectedJobs.size > 0 && (
                <span className="text-sm text-gray-400">
                  {selectedJobs.size} job{selectedJobs.size === 1 ? '' : 's'} selected
                </span>
              )}
            </div>
            {selectedJobs.size > 0 && (
              <button
                onClick={handleBulkActivate}
                disabled={bulkActivating}
                className="btn-primary flex items-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                {bulkActivating ? 'Activating...' : `Activate ${selectedJobs.size} Job${selectedJobs.size === 1 ? '' : 's'}`}
              </button>
            )}
          </div>
        </div>
      )}

      {message && (
        <div
          className={`p-4 rounded-xl ${
            message.includes('success') || message.includes('Activated')
              ? 'bg-green-900/30 text-green-300 border-2 border-green-500/50'
              : 'bg-red-900/30 text-red-300 border-2 border-red-500/50'
          }`}
        >
          {message}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="card text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-100 mb-2">No jobs found</h2>
          <p className="text-gray-400 mb-4">Create your first job posting to get started.</p>
          <Link to="/institution/jobs/create" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Job
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {job.status === 'draft' && (
                    <button
                      onClick={() => toggleJobSelection(job.id)}
                      className="mt-1"
                    >
                      {selectedJobs.has(job.id) ? (
                        <CheckSquare className="w-5 h-5 text-primary-400" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-500 hover:text-gray-400" />
                      )}
                    </button>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-gray-100">{job.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'active'
                          ? 'bg-green-900/50 text-green-300 border border-green-500/30'
                          : job.status === 'draft'
                          ? 'bg-gray-700 text-gray-300 border border-gray-500/30'
                          : 'bg-red-900/50 text-red-300 border border-red-500/30'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-2">
                      <span>{job.role}</span>
                      <span>•</span>
                      <span className="capitalize">{job.subject.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{job.city}, {job.state}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Experience: {job.required_experience_years}+ years</span>
                      <span>•</span>
                      <span>Questions: {job.screening_question_count}</span>
                      <span>•</span>
                      <span>Passing: {job.passing_score_threshold}%</span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  {job.status === 'draft' && (
                    <button
                      onClick={() => handleActivateJob(job.id)}
                      disabled={activating === job.id}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Rocket className="w-4 h-4" />
                      {activating === job.id ? 'Activating...' : 'Activate'}
                    </button>
                  )}
                  <Link
                    to={`/institution/jobs/${job.id}`}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

