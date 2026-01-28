import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Disc, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, user, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Redirect when user is logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, integrate email/password auth here
    console.log('Sign Up with:', formData);
    navigate('/');
  };

  const handleGoogleSignUp = () => {
    // loginWithGoogle triggers the popup. 
    // The state update happens in AuthContext, triggering the useEffect above.
    loginWithGoogle();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
           <Link to="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="relative">
              <Disc className="h-10 w-10 text-white group-hover:rotate-90 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full animate-pulse"></div>
            </div>
          </Link>
          <h2 className="text-3xl font-black text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-400">
            MuzikPick과 함께 음악 여행을 시작하세요.
          </p>
        </div>

        {/* Card */}
        <div className="bg-dark-card border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
          {/* Google Sign Up */}
          <button 
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
             {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google 계정으로 가입하기
                </>
            )}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-card text-gray-500">또는 이메일로 가입</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSignUp}>
             <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">닉네임</label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="음악대장"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">이메일</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">비밀번호</label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">비밀번호 확인</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
            </div>

            <div className="pt-2">
                <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 group"
                >
                가입하기
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-bold text-white hover:text-primary transition-colors">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;