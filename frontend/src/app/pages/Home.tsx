import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  BookOpen,
  Mic,
  Camera,
  Video,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Sparkles,
  Bot,
  Zap,
  Hand,
  MessageCircle,
  Award,
  Globe,
  CheckCircle2,
  LayoutDashboard,
  Lock
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

export function Home() {
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);

  const features = [
    {
      icon: Bot,
      title: 'AI Dictionary Chatbot',
      description: 'Ask our AI chatbot for any sign and get instant video demonstrations',
      path: '/dictionary',
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      icon: Camera,
      title: 'Sign to Text',
      description: 'Translate sign language to text using AI recognition',
      path: '/sign-to-text',
      gradient: 'from-green-400 to-emerald-400'
    },
    {
      icon: Mic,
      title: 'Voice to Text',
      description: 'Convert speech to text ',
      path: '/voice-to-text',
      gradient: 'from-orange-400 to-red-400'
    },
    {
      icon: Video,
      title: 'Video Call Translation',
      description: 'Live video calls with real-time voice and sign translation',
      path: '/video-call',
      gradient: 'from-purple-400 to-pink-400'
    }
  ];

  const stats = [
    { icon: Users, label: 'Active Learners', value: '50K+', gradient: 'from-blue-500 to-cyan-500' },
    { icon: BookOpen, label: 'Sign Videos', value: '10K+', gradient: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, label: 'Accuracy Rate', value: '95%', gradient: 'from-green-500 to-emerald-500' }
  ];

  const benefits = [
    
    { icon: CheckCircle2, text: 'AI-powered Sign to text conversion' },
    { icon: CheckCircle2, text: 'Interactive chatbot assistant' },
    { icon: CheckCircle2, text: 'AI-powered Voice to text conversion' },
    { icon: CheckCircle2, text: 'Real-time video translation' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Hero Section - Enhanced */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center mt-0">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Content */}
          <motion.div variants={itemVariants} className="space-y-5">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex justify-center"
            >
              <Badge className="bg-gradient-to-r from-blue-400 to-purple-600 text-white border-0 text-xs sm:text-sm px-2 sm:px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Welcome to the Future of Communication</span>
                <span className="sm:hidden">Future of Communication</span>
              </Badge>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight px-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Break Barriers
              </span>
              <br />
              <span className="text-gray-900">
                With AI-Powered
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-600 bg-clip-text text-transparent">
                Sign Language
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed px-4"
            >
              Master sign language through real-time translation , AI conversations
              and video calls. 
            </motion.p>

            {/* Benefits List */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto px-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-2 text-gray-700 text-left"
                  >
                    <Icon className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">{benefit.text}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 pt-3 justify-center px-4"
            >
              <Link to="/dictionary" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:opacity-90 text-white shadow-lg px-4 sm:px-6 py-5 text-sm sm:text-base">
                    <Zap className="mr-2 w-4 h-4" />
                    Start Learning Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-4 sm:px-6 py-5 border-2 hover:bg-gray-50 text-sm sm:text-base"
                  onClick={() => setShowVideoCallModal(true)}
                >
                  <Video className="mr-2 w-4 h-4" />
                  Try Video Call
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Centered Animated Visual */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
        >
            {/* Floating Hand Icon Animation */}
            <div className="relative h-20 w-20">
              {/* Main Animated Icon */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                  <Hand className="w-9 h-9 text-white" />
                </div>
              </motion.div>

              {/* Sparkles */}
              {[...Array(6)].map((_, i) => {
                const angle = (i * 360) / 6;
                const radius = 50;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                return (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      marginLeft: `${x}px`,
                      marginTop: `${y}px`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 sm:px-0">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="text-center shadow-2xl hover:shadow-3xl transition-all border-2 border-gray-100">
                <CardContent className="pt-6 pb-6 sm:pt-8 sm:pb-8">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                    className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </motion.div>
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.section>

      {/* Features Grid */}
      <motion.section variants={itemVariants} className="space-y-6 sm:space-y-8 px-4 sm:px-0">
        <div className="text-center space-y-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 mx-auto mb-2" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent px-4">
            Powerful AI Features
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Everything you need to master sign language and communicate effortlessly
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link to={feature.path}>
                  <Card className="h-full hover:shadow-xl transition-all cursor-pointer group border-2 border-transparent hover:border-blue-300 bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold">{feature.title}</h3>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                      <div className="flex items-center text-blue-600 group-hover:translate-x-2 transition-transform font-medium text-sm">
                        <span>Explore feature</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Video/Image Showcase */}
      <motion.section
        variants={itemVariants}
        className="relative rounded-2xl overflow-hidden h-[250px] sm:h-[300px] md:h-[350px] shadow-xl mx-4 sm:mx-0"
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1752937327096-b78cd31658e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduJTIwbGFuZ3VhZ2UlMjBoYW5kcyUyMGNvbW11bmljYXRpb24lMjBkaXZlcnNpdHl8ZW58MXx8fHwxNzc1ODQ0MzQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Sign language communication"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-purple-900/95 to-pink-900/95 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center text-white space-y-3 sm:space-y-4 px-4 max-w-3xl"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Hand className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-2" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Breaking Communication Barriers</h2>
            <p className="text-sm sm:text-base md:text-lg opacity-90 leading-relaxed">
              Join a global community dedicated to making sign language accessible to everyone through the power of AI
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  className="bg-white text-blue-600 hover:bg-gray-100 px-4 sm:px-6 py-4 sm:py-5 text-sm sm:text-base"
                  onClick={() => setShowVideoCallModal(true)}
                >
                  <Video className="mr-2 w-4 h-4" />
                  <span className="hidden sm:inline">Start Video Call</span>
                  <span className="sm:hidden">Video Call</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials/Social Proof */}
      <motion.section variants={itemVariants} className="space-y-6 px-4 sm:px-0">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold">Trusted by Thousands</h2>
          <p className="text-sm sm:text-base text-gray-600">See what our community is saying</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: 'Sarah Johnson',
              role: 'Sign Language Learner',
              image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
              text: 'SignVerse transformed my learning! The AI chatbot is incredibly helpful.',
              rating: 5
            },
            {
              name: 'Michael Chen',
              role: 'Deaf Community Member',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
              text: 'The video call feature is a game-changer for my daily communications.',
              rating: 5
            },
            {
              name: 'Emma Williams',
              role: 'ASL Instructor',
              image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
              text: 'I recommend SignVerse to all my students. The accuracy is impressive!',
              rating: 5
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-all">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl p-6 sm:p-8 md:p-10 text-center text-white shadow-xl relative overflow-hidden mx-4 sm:mx-0"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              <Hand className="w-8 h-8" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 space-y-3 sm:space-y-4">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Star className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold px-4">Ready to Start Your Journey?</h2>
          <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-2xl mx-auto px-4">
            Join 50,000+ learners using AI to master sign language and connect with the world
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link to="/dictionary" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 border-0 px-4 sm:px-6 py-4 sm:py-5 text-sm sm:text-base">
                  <MessageCircle className="mr-2 w-4 h-4" />
                  Talk to AI Assistant
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 px-4 sm:px-6 py-4 sm:py-5 text-sm sm:text-base"
                onClick={() => setShowVideoCallModal(true)}
              >
                <Video className="mr-2 w-4 h-4" />
                Try Video Call
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Video Call Unlock Modal */}
      <Dialog open={showVideoCallModal} onOpenChange={setShowVideoCallModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-center text-2xl">Feature Locked</DialogTitle>
            <DialogDescription className="text-center text-lg pt-4">
              This feature will be unlocked in <span className="font-semibold text-purple-600">FYP II</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => setShowVideoCallModal(false)}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90"
            >
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}