import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, User as UserIcon, Disc, X, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search);
      setSearchQuery(params.get('q') ?? '');
    }
  }, [location.pathname, location.search]);

  const navItems = [
    { label: '베스트 앨범', path: '/best-albums' },
    { label: '탐색', path: '/discover' },
    { label: '신작', path: '/new-releases' },
    { label: '장르', path: '/genres' },
    { label: '커뮤니티', path: '/community' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full flex flex-col bg-dark-bg/95 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      {/* Top Row: Logo & Search */}
      <div className="w-full border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="relative">
                <Disc className="h-8 w-8 text-white group-hover:rotate-90 transition-transform duration-500" />
                <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                MuzikPick
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <form className="relative group" onSubmit={handleSearchSubmit}>
                <input 
                  type="text" 
                  placeholder="아티스트, 앨범, 트랙 검색..." 
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full bg-dark-card border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder-gray-500 group-hover:border-white/20"
                  aria-label="검색"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                // Logged In State
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <span className="hidden sm:block text-sm font-medium text-white">{user.name}</span>
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full border border-white/10 ring-2 ring-transparent hover:ring-primary/50 transition-all" 
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-white/10 rounded-xl shadow-xl py-1 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link to="/mypage" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <UserIcon className="w-4 h-4" />
                        마이페이지
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Logged Out State
                <>
                  <Link 
                    to="/login"
                    className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white px-3 py-2 transition-colors"
                  >
                    로그인
                  </Link>
                  <Link 
                    to="/signup"
                    className="hidden sm:block text-sm font-medium text-white bg-primary px-4 py-1.5 rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    가입하기
                  </Link>
                </>
              )}
              
              <button 
                className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5 text-gray-300" /> : <Menu className="h-5 w-5 text-gray-300" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Navigation (Desktop) */}
      <div className="hidden md:block w-full bg-dark-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12 gap-8 text-sm font-medium">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={index} 
                  to={item.path} 
                  className={`relative transition-colors hover:text-white py-1 group ${isActive ? 'text-white' : 'text-gray-400'}`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-bg border-b border-white/5 px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
           <form className="relative" onSubmit={handleSearchSubmit}>
                <input 
                  type="text" 
                  placeholder="검색..." 
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full bg-dark-card border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50"
                  aria-label="검색"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
            <div className="grid grid-cols-2 gap-4">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={index} 
                    to={item.path} 
                    className={`text-sm font-medium py-2 border-b border-white/5 ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {!user && (
                <div className="col-span-2 pt-2 flex gap-2">
                   <Link 
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex-1 py-2 text-center text-sm font-medium text-gray-300 bg-white/5 rounded-lg"
                   >
                      로그인
                   </Link>
                   <Link 
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex-1 py-2 text-center text-sm font-medium text-white bg-primary rounded-lg"
                   >
                      가입하기
                   </Link>
                </div>
              )}
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
