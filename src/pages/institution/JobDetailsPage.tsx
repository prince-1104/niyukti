import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Sparkles, Users, AlertCircle, TrendingUp, MapPin, BookOpen, Briefcase, Rocket, X, CheckCircle, FileText } from 'lucide-react';
import type { Job, GenerateQuestionsRequest, Subject, DifficultyLevel, Question } from '../../types';

export default function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(false);
  const [activating, setActivating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  
  // Question generation form state
  const [formData, setFormData] = useState<GenerateQuestionsRequest>({
    class_level: undefined,
    subject: undefined,
    easy_count: undefined,
    medium_count: undefined,
    hard_count: undefined,
    mcq_ratio: 0.7,
  });

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
      loadQuestions();
    }
  }, [jobId, job]);

  const loadQuestions = async () => {
    if (!jobId) return;
    setLoadingQuestions(true);
    try {
      const data = await api.getJobQuestions(Number(jobId));
      setQuestions(data);
    } catch (error) {
      console.error('Failed to load questions:', error);
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!jobId) return;

    setGenerating(true);
    setMessage(null);
    try {
      // Build request payload - only include fields that have values
      const request: GenerateQuestionsRequest = {};
      if (formData.class_level) request.class_level = formData.class_level;
      if (formData.subject) request.subject = formData.subject;
      if (formData.easy_count !== undefined && formData.easy_count > 0) request.easy_count = formData.easy_count;
      if (formData.medium_count !== undefined && formData.medium_count > 0) request.medium_count = formData.medium_count;
      if (formData.hard_count !== undefined && formData.hard_count > 0) request.hard_count = formData.hard_count;
      if (formData.mcq_ratio !== undefined) request.mcq_ratio = formData.mcq_ratio;
      
      const response = await api.generateQuestions(Number(jobId), Object.keys(request).length > 0 ? request : undefined);
      setMessage(`Successfully generated ${response.total_questions} questions!`);
      setShowGenerateModal(false);
      // Reset form
      setFormData({
        class_level: undefined,
        subject: undefined,
        easy_count: undefined,
        medium_count: undefined,
        hard_count: undefined,
        mcq_ratio: 0.7,
      });
      await loadJob();
      await loadQuestions(); // Reload questions after generation
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to generate questions');
    } finally {
      setGenerating(false);
    }
  };

  const openGenerateModal = () => {
    // Initialize form with job defaults
    setFormData({
      class_level: undefined, // Will use job's default (determined from role)
      subject: undefined, // Will use job's subject if not changed
      easy_count: undefined,
      medium_count: undefined,
      hard_count: undefined,
      mcq_ratio: 0.7,
    });
    setShowGenerateModal(true);
    setMessage(null);
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
              onClick={openGenerateModal}
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

        {/* Generated Questions Section */}
        <div className="card col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-400" />
              Generated Questions
            </h2>
            {questions.length > 0 && (
              <button
                onClick={loadQuestions}
                disabled={loadingQuestions}
                className="text-sm text-primary-400 hover:text-primary-300 disabled:opacity-50"
              >
                {loadingQuestions ? 'Refreshing...' : 'Refresh'}
              </button>
            )}
          </div>

          {loadingQuestions ? (
            <div className="text-center py-8 text-gray-400">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No questions generated yet.</p>
              <p className="text-sm text-gray-500 mt-1">Click "Generate Questions" to create screening questions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-400 mb-4">
                Total: {questions.length} question{questions.length !== 1 ? 's' : ''}
              </div>
              {questions.map((question, index) => (
                <div key={question.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-300 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            question.question_type === 'mcq'
                              ? 'bg-blue-900/30 text-blue-300 border border-blue-500/30'
                              : 'bg-purple-900/30 text-purple-300 border border-purple-500/30'
                          }`}>
                            {question.question_type.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            Class {question.class_level} • {question.subject.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{question.points} point{question.points !== 1 ? 's' : ''}</span>
                  </div>
                  
                  <p className="text-gray-200 mb-3">{question.question_text}</p>
                  
                  {question.question_type === 'mcq' && question.options && (
                    <div className="space-y-2 mb-3">
                      {question.options.map((option, optIdx) => {
                        const isCorrect = option === question.correct_answer || 
                                         question.correct_answer === String(optIdx) ||
                                         question.correct_answer === String.fromCharCode(65 + optIdx);
                        return (
                          <div
                            key={optIdx}
                            className={`px-3 py-2 rounded border ${
                              isCorrect
                                ? 'bg-green-900/20 border-green-500/50 text-green-300'
                                : 'bg-gray-700/50 border-gray-600 text-gray-300'
                            }`}
                          >
                            <span className="font-medium mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                            {option}
                            {isCorrect && (
                              <CheckCircle className="w-4 h-4 inline-block ml-2 text-green-400" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {question.question_type === 'descriptive' && (
                    <div className="space-y-2">
                      {question.expected_keywords && question.expected_keywords.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Expected Keywords:</p>
                          <div className="flex flex-wrap gap-2">
                            {question.expected_keywords.map((keyword, kwIdx) => (
                              <span key={kwIdx} className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded text-xs border border-purple-500/30">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {question.expected_answer_text && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Expected Answer:</p>
                          <p className="text-sm text-gray-300 bg-gray-700/30 p-2 rounded border border-gray-600">
                            {question.expected_answer_text}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-500">
                      Correct Answer: <span className="text-gray-300">{question.correct_answer}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Generate Questions Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-gray-100">Generate Questions</h2>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Class Level */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Class Level (1-10)
                </label>
                <select
                  value={formData.class_level || ''}
                  onChange={(e) => setFormData({ ...formData, class_level: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Use Job Default</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                    <option key={level} value={level}>Class {level}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject || ''}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value ? (e.target.value as Subject) : undefined })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Use Job Default: {job?.subject?.replace('_', ' ')}</option>
                  <option value="science">Science</option>
                  <option value="maths">Maths</option>
                  <option value="social_science">Social Science</option>
                  <option value="ict">ICT</option>
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="kannada">Kannada</option>
                  <option value="marathi">Marathi</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Current job subject: <span className="text-gray-400 capitalize">{job?.subject?.replace('_', ' ')}</span>
                </p>
              </div>

              {/* Difficulty Level Counts */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Questions by Difficulty Level
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="flex-1 text-sm text-gray-400">Easy</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.easy_count || ''}
                      onChange={(e) => setFormData({ ...formData, easy_count: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="0"
                      className="w-24 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 text-sm text-gray-400">Medium</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.medium_count || ''}
                      onChange={(e) => setFormData({ ...formData, medium_count: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="0"
                      className="w-24 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 text-sm text-gray-400">Hard</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.hard_count || ''}
                      onChange={(e) => setFormData({ ...formData, hard_count: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="0"
                      className="w-24 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Specify how many questions you want at each difficulty level. 
                  <br />
                  <span className="text-gray-500">If all are left blank (0), will use job's default question count ({job?.screening_question_count || 10} questions).</span>
                </p>
              </div>

              {/* MCQ Ratio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  MCQ Ratio: {Math.round((formData.mcq_ratio || 0.7) * 100)}% MCQ, {Math.round((1 - (formData.mcq_ratio || 0.7)) * 100)}% Descriptive
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.mcq_ratio || 0.7}
                  onChange={(e) => setFormData({ ...formData, mcq_ratio: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0% MCQ</span>
                  <span>50% MCQ</span>
                  <span>100% MCQ</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  This ratio applies to each difficulty level separately (if difficulty counts are specified).
                  <br />
                  <span className="text-gray-500">For example: If Easy=3 and ratio=70%, you'll get 2 MCQ + 1 Descriptive easy questions.</span>
                </p>
              </div>

              {/* Total Count Preview */}
              {(formData.easy_count || formData.medium_count || formData.hard_count) && (
                <div className="bg-primary-900/20 border border-primary-500/30 rounded-lg p-4">
                  <p className="text-sm text-primary-300">
                    Total Questions: {(formData.easy_count || 0) + (formData.medium_count || 0) + (formData.hard_count || 0)}
                    {' '}(Easy: {formData.easy_count || 0}, Medium: {formData.medium_count || 0}, Hard: {formData.hard_count || 0})
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
              <button
                onClick={() => setShowGenerateModal(false)}
                disabled={generating}
                className="px-4 py-2 text-gray-300 hover:text-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateQuestions}
                disabled={generating}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                {generating ? 'Generating...' : 'Generate Questions'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

