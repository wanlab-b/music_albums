import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AlbumDetail from './pages/AlbumDetail';
import BestAlbums from './pages/BestAlbums';
import Discover from './pages/Discover';
import NewReleases from './pages/NewReleases';
import Genres from './pages/Genres';
import Community from './pages/Community';
import Search from './pages/Search';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MyPage from './pages/MyPage';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const Footer: React.FC = () => (
  <footer className="border-t border-white/5 bg-dark-bg mt-12 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4">MuzikPick</h2>
          <p className="text-gray-400 text-sm max-w-sm">
            음악을 사랑하는 사람들을 위한 기록 공간.<br/>
            앨범을 평가하고, 리뷰를 나누고, 새로운 음악을 발견하세요.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-primary transition-colors">차트</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">신작</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">커뮤니티</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Legal</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-primary transition-colors">이용약관</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">개인정보처리방침</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">문의하기</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-white/5 pt-8 text-center text-xs text-gray-600">
        &copy; 2024 MuzikPick. All rights reserved.
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const GOOGLE_CLIENT_ID = "892616754420-o6d1r1ntmgkfhq90djvdumg0sn0pnk97.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-dark-bg text-white font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/best-albums" element={<BestAlbums />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/new-releases" element={<NewReleases />} />
                <Route path="/genres" element={<Genres />} />
                <Route path="/community" element={<Community />} />
                <Route path="/search" element={<Search />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/album/:id" element={<AlbumDetail />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
