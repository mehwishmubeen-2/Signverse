import { useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  TrendingUp,
  Clock,
  Target,
  BookmarkPlus,
  MessageSquare,
  Video,
  Mic,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { signDictionary } from '../data/signData';
import { Link } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function Dashboard() {
  const [favorites] = useState(signDictionary.slice(0, 4));
  const [recentActivity] = useState([
    { id: 1, action: 'Learned sign', item: 'hello', time: '2 hours ago', icon: BookmarkPlus, color: 'bg-blue-100 text-blue-600' },
    { id: 2, action: 'Used AI Dictionary', item: 'thank you', time: '5 hours ago', icon: MessageSquare, color: 'bg-purple-100 text-purple-600' },
    { id: 3, action: 'Video call session', item: '15 minutes', time: '1 day ago', icon: Video, color: 'bg-green-100 text-green-600' },
    { id: 4, action: 'Voice to text', item: 'Practice session', time: '2 days ago', icon: Mic, color: 'bg-orange-100 text-orange-600' },
  ]);

  const stats = [
    {
      label: 'Signs Learned',
      value: '0',
      unit: 'signs',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-400 to-cyan-400',
      trend: '+8 this week'
    },
    {
      label: 'Video Calls',
      value: '0',
      unit: 'calls',
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-400 to-pink-400',
      trend: '+3 this week'
    },
    {
      label: 'AI Queries',
      value: '0',
      unit: 'questions',
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-400 to-emerald-400',
      trend: '+45 this week'
    },
    {
      label: 'Total Time',
      value: '0',
      unit: 'hours',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-400 to-red-400',
      trend: '+2.5h this week'
    },
  ];

  const weeklyProgress = [
    { id: 'mon', day: 'Mon', minutes: 45, color: '#60a5fa' },
    { id: 'tue', day: 'Tue', minutes: 30, color: '#a78bfa' },
    { id: 'wed', day: 'Wed', minutes: 60, color: '#f472b6' },
    { id: 'thu', day: 'Thu', minutes: 25, color: '#2dd4bf' },
    { id: 'fri', day: 'Fri', minutes: 50, color: '#34d399' },
    { id: 'sat', day: 'Sat', minutes: 40, color: '#fb923c' },
    { id: 'sun', day: 'Sun', minutes: 35, color: '#fbbf24' },
  ];

  const maxMinutes = Math.max(...weeklyProgress.map(d => d.minutes));

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
    <div className="relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 space-y-6 px-4 sm:px-0"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">Welcome back! Here's your learning progress</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <Badge variant="outline" className="text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">
                      {stat.value}
                      <span className="text-lg text-gray-600 ml-1">{stat.unit}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Bar Chart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weeklyProgress}
                      margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={{ stroke: '#d1d5db' }}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={{ stroke: '#d1d5db' }}
                        label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        cursor={{ fill: 'rgba(96, 165, 250, 0.1)' }}
                        formatter={(value: number) => [`${value} minutes`, 'Time']}
                      />
                      <Bar dataKey="minutes" radius={[8, 8, 0, 0]}>
                        {weeklyProgress.map((entry, index) => (
                          <Cell key={`bar-cell-${entry.id}-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Summary */}
                <div className="pt-4 border-t grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">285</p>
                    <p className="text-sm text-gray-600">Total Minutes</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">41</p>
                    <p className="text-sm text-gray-600">Avg per Day</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Usage */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Feature Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { name: 'AI Dictionary', usage: 0, icon: MessageSquare, color: 'bg-purple-600' },
                { name: 'Video Calls', usage: 0, icon: Video, color: 'bg-green-600' },
                { name: 'Text to Sign', usage: 0, icon: Target, color: 'bg-blue-600' },
                { name: 'Voice to Text', usage: 0, icon: Mic, color: 'bg-orange-600' },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-gray-600">{item.usage}%</span>
                    </div>
                    <Progress value={item.usage} className="h-2" />
                  </motion.div>
                );
              })}

              <Link to="/dictionary">
                <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90">
                  Explore Features
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Favorites */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5" />
                Favorite Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {favorites.map((sign, index) => (
                  <motion.div
                    key={sign.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:from-blue-50 hover:to-purple-50 transition-all cursor-pointer border border-gray-100"
                  >
                    <div>
                      <p className="font-medium capitalize">{sign.word}</p>
                      <p className="text-sm text-gray-600 capitalize">{sign.category}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {sign.difficulty}
                    </Badge>
                  </motion.div>
                ))}
                <Link to="/dictionary">
                  <Button variant="outline" className="w-full">
                    View All Signs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-start gap-3 cursor-pointer"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.action}</span>
                          {' '}
                          <span className="text-gray-600">{activity.item}</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </motion.div>
    </div>
  );
}