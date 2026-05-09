import { Outlet, Link, useLocation } from 'react-router';
import { motion } from 'motion/react';
import {
  Home,
  BookOpen,
  MessageSquare,
  Mic,
  Camera,
  Video,
  LayoutDashboard,
  User,
  Menu,
  X,
  LogIn,
  LogOut,
  Hand,
  Sparkles,
  Bot,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const navigation = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'AI Dictionary', path: '/dictionary', icon: BookOpen },
    { name: 'Sign to Text', path: '/sign-to-text', icon: Camera },
    { name: 'Voice to Text', path: '/voice-to-text', icon: Mic },
    { name: 'Video Call', path: '/video-call', icon: Video },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              onClick={() => setShowAuthModal(true)}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white text-2xl">👋</span>
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SignVerse
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigation.slice(0, 6).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center gap-2">
                {user ? (
                  <>
                    <Link to="/profile">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-400 to-purple-400 text-white border-0 hover:opacity-90">
                          <User className="w-4 h-4 mr-2" />
                          {user.email?.split('@')[0] ?? 'Profile'}
                        </Button>
                      </motion.div>
                    </Link>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" onClick={handleLogout} className="border-gray-300 text-gray-600 hover:bg-gray-100">
                        <LogOut className="w-4 h-4 mr-1" />
                        Logout
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm" className="border-gray-300 text-gray-600 hover:bg-gray-100">
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </Button>
                      </motion.div>
                    </Link>
                    <Link to="/auth?mode=signup">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-400 to-purple-400 text-white border-0 hover:opacity-90">
                          <User className="w-4 h-4 mr-2" />
                          Sign Up
                        </Button>
                      </motion.div>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-200"
            >
              <nav className="flex flex-col space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-5 h-5" />
                      <span>{user.email?.split('@')[0] ?? 'Profile'}</span>
                    </Link>
                    <button
                      onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/auth?mode=signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 text-white"
                    >
                      <User className="w-5 h-5" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p>© 2026 SignVerse. Empowering communication through sign language.</p>
          </div>
        </div>
      </footer>

      {/* App Introduction Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mx-auto mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <Hand className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            <DialogTitle className="text-center text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome to SignVerse
            </DialogTitle>
            <DialogDescription className="text-gray-700 leading-relaxed text-center text-base pt-4">
              SignVerse is an AI-powered platform bridging the communication gap between hearing and deaf communities. With over 70 million deaf people worldwide relying on sign language, we're making it accessible to everyone through cutting-edge technology. Our mission is to foster social inclusion, empower independence, and create a world where communication knows no barriers. Join us in building a more inclusive society where sign language is recognized, celebrated, and accessible to all.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}