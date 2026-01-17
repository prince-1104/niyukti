import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, UserPlus, Mail, Lock, User, Phone, Briefcase, Building2, Search, Users, TrendingUp, CheckCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['candidate', 'institution']),
  phone: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);
    try {
      await login(data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-bold text-[#800020] mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600" strokeWidth={2.5} />
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-[#800020] placeholder-slate-500 font-semibold hover:border-blue-400 transition-all duration-200"
            placeholder="you@example.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm font-semibold text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-bold text-[#800020] mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600" strokeWidth={2.5} />
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-[#800020] placeholder-slate-500 font-semibold hover:border-blue-400 transition-all duration-200"
            placeholder="Enter your password"
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm font-semibold text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 focus:ring-2" />
          <span className="ml-2 text-sm font-bold text-[#800020]">Remember me</span>
        </label>
        <a href="#" className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LogIn className="w-5 h-5 stroke-[2.5]" />
        {loading ? 'Logging in...' : 'Sign In'}
      </button>
    </form>
  );
}

function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'candidate',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    setLoading(true);
    try {
      await signup(data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-[#800020] mb-3">
          I am a
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={`cursor-pointer p-4 border-2 rounded-xl transition-all duration-200 ${
            selectedRole === 'candidate'
              ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md ring-2 ring-blue-200'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 bg-white'
          }`}>
            <input
              type="radio"
              value="candidate"
              {...register('role')}
              className="sr-only"
            />
            <div className="text-center">
              <div className={`font-bold ${selectedRole === 'candidate' ? 'text-blue-700' : 'text-[#800020]'}`}>Candidate</div>
              <div className={`text-xs mt-1 font-semibold ${selectedRole === 'candidate' ? 'text-blue-600' : 'text-[#800020]'}`}>Educator</div>
            </div>
          </label>
          <label className={`cursor-pointer p-4 border-2 rounded-xl transition-all duration-200 ${
            selectedRole === 'institution'
              ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md ring-2 ring-blue-200'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 bg-white'
          }`}>
            <input
              type="radio"
              value="institution"
              {...register('role')}
              className="sr-only"
            />
            <div className="text-center">
              <div className={`font-bold ${selectedRole === 'institution' ? 'text-blue-700' : 'text-[#800020]'}`}>Institution</div>
              <div className={`text-xs mt-1 font-semibold ${selectedRole === 'institution' ? 'text-blue-600' : 'text-[#800020]'}`}>School/College</div>
            </div>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="full_name" className="block text-sm font-bold text-[#800020] mb-2">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600" strokeWidth={2.5} />
          <input
            id="full_name"
            type="text"
            {...register('full_name')}
            className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-[#800020] placeholder-slate-500 font-semibold hover:border-blue-400 transition-all duration-200"
            placeholder={selectedRole === 'candidate' ? 'John Doe' : 'ABC School'}
          />
        </div>
        {errors.full_name && (
          <p className="mt-1 text-sm font-semibold text-red-600">{errors.full_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-bold text-[#800020] mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600" strokeWidth={2.5} />
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-[#800020] placeholder-slate-500 font-semibold hover:border-blue-400 transition-all duration-200"
            placeholder="you@example.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm font-semibold text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-bold text-[#800020] mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600" strokeWidth={2.5} />
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-[#800020] placeholder-slate-500 font-semibold hover:border-blue-400 transition-all duration-200"
            placeholder="••••••••"
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm font-semibold text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-bold text-[#800020] mb-2">
          Phone <span className="text-[#800020] font-semibold">(Optional)</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600" strokeWidth={2.5} />
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-[#800020] placeholder-slate-500 font-semibold hover:border-blue-400 transition-all duration-200"
            placeholder="+91 9876543210"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <UserPlus className="w-5 h-5 stroke-[2.5]" />
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-blue-900 flex">
      {/* Left Banner Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{
        background: 'linear-gradient(to bottom, #7e22ce 0%, #a855f7 25%, #60a5fa 50%, #cbd5e1 75%, #ffffff 100%)'
      }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl mb-6 shadow-xl ring-2 ring-white/30">
              <span className="text-3xl font-bold text-white">N</span>
            </div>
            <h1 className="text-5xl font-extrabold text-black mb-4 leading-tight">
              AI-Assisted Hiring
              <br />
              <span className="text-black font-bold">Made Simple</span>
            </h1>
            <p className="text-xl font-medium text-black mb-8 leading-relaxed">
              Connect educators with institutions seamlessly. Find the perfect match with AI-powered screening.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-xl ring-2 ring-purple-300">
                <Search className="w-6 h-6 text-purple-600" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Smart Job Matching</h3>
                <p className="text-black font-medium">AI-powered algorithms match educators with the perfect roles</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-xl ring-2 ring-blue-300">
                <Users className="w-6 h-6 text-blue-600" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">For Institutions</h3>
                <p className="text-black font-medium">Streamline your hiring process with intelligent candidate screening</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-xl ring-2 ring-purple-300">
                <TrendingUp className="w-6 h-6 text-purple-600" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">Easy Application</h3>
                <p className="text-black font-medium">Apply to multiple positions with one comprehensive profile</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-black/20">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" strokeWidth={3} />
                <span className="font-bold text-black">AI-Powered Screening</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" strokeWidth={3} />
                <span className="font-bold text-black">Curriculum-Based Matching</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col bg-gradient-to-b from-white to-slate-50">
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-4 shadow-lg ring-2 ring-blue-100 lg:hidden">
                <span className="text-2xl font-bold text-white">N</span>
              </div>
              <h2 className="text-3xl font-extrabold text-[#800020] mb-2">
                {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-[#800020] font-bold">
                {activeTab === 'login' ? 'Sign in to your Niyukti account' : 'Join Niyukti to get started'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'signup'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200/50 ring-1 ring-slate-100">
              {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-center text-sm font-bold text-[#800020]">
                  {activeTab === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('signup')}
                        className="text-purple-600 hover:text-purple-700 font-bold transition-colors"
                      >
                        Create account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-purple-600 hover:text-purple-700 font-bold transition-colors"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
