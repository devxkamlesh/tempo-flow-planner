
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalendar } from '@/context/CalendarContext';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Star, ListTodo, Bell, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { events, selectedDate } = useCalendar();
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Get today's events
  const todayEvents = events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  // Get upcoming events (next 7 days excluding today)
  const upcomingEvents = events.filter(event => {
    const eventDate = format(event.start, 'yyyy-MM-dd');
    const today = format(new Date(), 'yyyy-MM-dd');
    const sevenDaysLater = format(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd');
    
    return eventDate > today && eventDate <= sevenDaysLater;
  }).slice(0, 5);

  // Calculate focus time hours for the week
  const focusTimeHours = events
    .filter(event => event.type === 'focus')
    .reduce((total, event) => {
      const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
      return total + duration;
    }, 0);

  useEffect(() => {
    // Show welcome toast on initial load
    if (showWelcome) {
      toast({
        title: "Welcome back!",
        description: `You have ${todayEvents.length} events scheduled for today.`,
        duration: 5000,
      });
      setShowWelcome(false);
    }
  }, [showWelcome, todayEvents.length, toast]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-6">Smart Calendar Dashboard</h1>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="glass-card hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-calendar" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {format(new Date(), 'EEEE, MMMM d')}
              </p>
              {todayEvents.length > 0 ? (
                <div className="space-y-2">
                  {todayEvents.map(event => (
                    <motion.div 
                      key={event.id} 
                      className="text-sm border-l-2 border-calendar pl-3 py-1 hover:bg-gray-50 rounded-r-md transition-colors"
                      whileHover={{ x: 5 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No events scheduled today</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="glass-card hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2 text-calendar" />
                Weekly Focus Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-full">
                <motion.div 
                  className="text-4xl font-bold text-calendar mb-1"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  {focusTimeHours.toFixed(1)}
                </motion.div>
                <p className="text-sm text-muted-foreground">Hours scheduled this week</p>
                
                <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
                  <motion.div 
                    className="bg-calendar h-2.5 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(focusTimeHours / 15 * 100, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  ></motion.div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {focusTimeHours.toFixed(1)}/15 hours (recommended)
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="glass-card hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium flex items-center">
                <Star className="h-5 w-5 mr-2 text-calendar" />
                Smart Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <motion.div 
                  className="bg-calendar-subtle rounded-md p-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className="text-sm font-medium">Schedule focus time</p>
                  <p className="text-xs text-gray-600 mb-2">You're most productive in the mornings</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Block 9-11 AM tomorrow
                  </Button>
                </motion.div>
                
                <motion.div 
                  className="bg-calendar-event-personal/50 rounded-md p-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className="text-sm font-medium">Time for a break?</p>
                  <p className="text-xs text-gray-600 mb-2">You haven't scheduled any personal time this week</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Find a good time
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="glass-card hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-calendar" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <motion.div 
                      key={event.id} 
                      className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                      whileHover={{ x: 5, backgroundColor: "rgba(243, 244, 246, 0.8)" }}
                    >
                      <div className={`w-2 h-full min-h-[2.5rem] rounded-full bg-calendar-event-${event.type}`}></div>
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-xs text-gray-500">
                          {format(event.start, 'EEE, MMM d • h:mm a')}
                        </p>
                        {event.location && (
                          <p className="text-xs text-gray-500">{event.location}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No upcoming events in the next 7 days</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="glass-card hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium flex items-center">
                <ListTodo className="h-5 w-5 mr-2 text-calendar" />
                Tasks Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-6">
                <motion.div 
                  className="flex justify-between items-center"
                  whileHover={{ x: 5 }}
                >
                  <p className="text-sm font-medium">Complete quarterly report</p>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> High
                  </span>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center"
                  whileHover={{ x: 5 }}
                >
                  <p className="text-sm font-medium">Review team project plan</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    Medium
                  </span>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center"
                  whileHover={{ x: 5 }}
                >
                  <p className="text-sm font-medium">Prepare for client meeting</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" /> Low
                  </span>
                </motion.div>
              </div>
              
              <div className="flex justify-center">
                <Button asChild variant="outline" className="hover:scale-105 transition-transform">
                  <Link to="/tasks">View All Tasks</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="fixed bottom-6 right-6 animate-pulse"
        whileHover={{ scale: 1.1, animationPlayState: 'paused' }}
        whileTap={{ scale: 0.9 }}
      >
        <Button size="icon" className="rounded-full h-12 w-12 shadow-lg">
          <Bell className="h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
