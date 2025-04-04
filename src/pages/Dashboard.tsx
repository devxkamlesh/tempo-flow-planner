
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalendar } from '@/context/CalendarContext';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Star, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { events, selectedDate } = useCalendar();
  
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

  return (
    <div className="dashboard">
      <h1 className="text-2xl font-bold mb-6">Smart Calendar Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card">
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
                  <div key={event.id} className="text-sm border-l-2 border-calendar pl-3 py-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No events scheduled today</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center">
              <Clock className="h-5 w-5 mr-2 text-calendar" />
              Weekly Focus Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-4xl font-bold text-calendar mb-1">
                {focusTimeHours.toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Hours scheduled this week</p>
              
              <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
                <div 
                  className="bg-calendar h-2.5 rounded-full" 
                  style={{ width: `${Math.min(focusTimeHours / 15 * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {focusTimeHours.toFixed(1)}/15 hours (recommended)
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center">
              <Star className="h-5 w-5 mr-2 text-calendar" />
              Smart Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-calendar-subtle rounded-md p-3">
                <p className="text-sm font-medium">Schedule focus time</p>
                <p className="text-xs text-gray-600 mb-2">You're most productive in the mornings</p>
                <Button variant="outline" size="sm" className="w-full">
                  Block 9-11 AM tomorrow
                </Button>
              </div>
              
              <div className="bg-calendar-event-personal/50 rounded-md p-3">
                <p className="text-sm font-medium">Time for a break?</p>
                <p className="text-xs text-gray-600 mb-2">You haven't scheduled any personal time this week</p>
                <Button variant="outline" size="sm" className="w-full">
                  Find a good time
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
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
                  <div key={event.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No upcoming events in the next 7 days</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center">
              <ListTodo className="h-5 w-5 mr-2 text-calendar" />
              Tasks Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Complete quarterly report</p>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                  High
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Review team project plan</p>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  Medium
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Prepare for client meeting</p>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Low
                </span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button asChild variant="outline">
                <Link to="/tasks">View All Tasks</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
