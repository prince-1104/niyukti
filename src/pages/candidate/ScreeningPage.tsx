import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import type { ScreeningAttempt, Question, AnswerSubmit } from '../../types';

export default function ScreeningPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<ScreeningAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (attemptId) {
      loadAttempt();
    }
  }, [attemptId]);

  const loadAttempt = async () => {
    try {
      const data = await api.getScreeningAttempt(Number(attemptId));
      setAttempt(data);
      // Initialize answers from existing data if any
      if (data.questions) {
        const initialAnswers: Record<number, string> = {};
        data.questions.forEach((q) => {
          initialAnswers[q.id] = '';
        });
        setAnswers(initialAnswers);
      }
    } catch (error) {
      console.error('Failed to load screening:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const submitAnswer = async (questionId: number, answerText: string) => {
    if (!answerText.trim()) return;

    try {
      await api.submitAnswer(Number(attemptId), {
        question_id: questionId,
        answer_text: answerText,
      });
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleSubmit = async () => {
    if (!attempt) return;

    // Submit all answers first
    for (const [questionId, answerText] of Object.entries(answers)) {
      if (answerText.trim()) {
        await submitAnswer(Number(questionId), answerText);
      }
    }

    // Submit the screening
    setSubmitting(true);
    try {
      const result = await api.submitScreening(Number(attemptId));
      
      if (result.is_passed) {
        alert(`Congratulations! You passed with ${result.percentage_score.toFixed(1)}%`);
        // TODO: Navigate to interview scheduling
      } else {
        alert(`You scored ${result.percentage_score.toFixed(1)}%. ${result.lms_url ? 'Redirecting to LMS...' : ''}`);
        if (result.lms_url) {
          window.location.href = result.lms_url;
        }
      }
    } catch (error) {
      console.error('Failed to submit screening:', error);
      alert('Failed to submit screening. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-300">Loading...</div>;
  }

  if (!attempt || !attempt.questions) {
    return <div className="text-center py-12 text-gray-300">Screening not found</div>;
  }

  const allAnswered = attempt.questions.every((q) => answers[q.id]?.trim());
  const answeredCount = Object.keys(answers).filter((k) => answers[Number(k)]?.trim()).length;
  const progress = (answeredCount / attempt.total_questions) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Screening Test</h1>
            <p className="text-gray-300 mt-1">
              Answer all questions to complete the screening
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Passing Score</div>
            <div className="text-lg font-semibold text-gray-100">{attempt.passing_threshold}%</div>
          </div>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>{answeredCount} of {attempt.total_questions} answered</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      <div className="space-y-6">
        {attempt.questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index + 1}
            value={answers[question.id] || ''}
            onChange={(value) => handleAnswerChange(question.id, value)}
            onSubmit={() => submitAnswer(question.id, answers[question.id])}
          />
        ))}
      </div>

      <div className="card bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-2 border-primary-500/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300 font-medium">Ready to submit?</p>
            <p className="text-sm text-gray-400 mt-1">
              {attempt.questions.length - answeredCount}{' '}
              {attempt.questions.length - answeredCount === 1 ? 'question' : 'questions'} remaining
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className={`btn-primary ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Submitting...' : 'Submit Screening'}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  index,
  value,
  onChange,
  onSubmit,
}: {
  question: Question;
  index: number;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const isAnswered = !!value.trim();
  
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Question {index}
            </span>
            <span className="text-xs text-gray-400 capitalize bg-gray-700 px-2 py-1 rounded">{question.question_type}</span>
            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">{question.points} points</span>
            {isAnswered && (
              <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Answered
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-100 mb-4">{question.question_text}</h3>
        </div>
      </div>

      {question.question_type === 'mcq' && question.options ? (
        <div className="space-y-2">
          {question.options.map((option, idx) => (
            <label
              key={idx}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                value === option
                  ? 'border-primary-500 bg-primary-900/30 text-primary-300'
                  : 'border-purple-500/30 hover:border-purple-500/50 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="mr-3 w-4 h-4 text-primary-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field min-h-[120px]"
          placeholder="Type your answer here..."
        />
      )}

      {isAnswered && (
        <button
          onClick={onSubmit}
          className="mt-4 text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1"
        >
          <CheckCircle className="w-4 h-4" />
          Answer Saved
        </button>
      )}
    </div>
  );
}

