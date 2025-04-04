
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Clock, Calendar, Bell, Palette, User, Languages } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="settings-page">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-calendar" />
              Calendar Settings
            </CardTitle>
            <CardDescription>
              Configure how your calendar displays and behaves
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="calendar-weeks">Start week on Monday</Label>
                <div className="text-sm text-muted-foreground">
                  Display Monday as the first day of the week
                </div>
              </div>
              <Switch id="calendar-weeks" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="calendar-past">Show past events</Label>
                <div className="text-sm text-muted-foreground">
                  Display events that have already occurred
                </div>
              </div>
              <Switch id="calendar-past" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="working-hours">Show working hours</Label>
                <div className="text-sm text-muted-foreground">
                  Highlight your working hours in the calendar
                </div>
              </div>
              <Switch id="working-hours" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-calendar" />
              Focus Time Settings
            </CardTitle>
            <CardDescription>
              Customize your focus sessions and break timers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="focus-duration">Focus duration</Label>
                <select id="focus-duration" className="w-full p-2 rounded-md border border-input">
                  <option value="20">20 minutes</option>
                  <option value="25" selected>25 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="short-break">Short break</Label>
                <select id="short-break" className="w-full p-2 rounded-md border border-input">
                  <option value="3">3 minutes</option>
                  <option value="5" selected>5 minutes</option>
                  <option value="10">10 minutes</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="long-break">Long break</Label>
                <select id="long-break" className="w-full p-2 rounded-md border border-input">
                  <option value="10">10 minutes</option>
                  <option value="15" selected>15 minutes</option>
                  <option value="20">20 minutes</option>
                  <option value="30">30 minutes</option>
                </select>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-break">Auto-start breaks</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically start breaks after focus sessions
                </div>
              </div>
              <Switch id="auto-break" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-focus">Auto-start focus</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically start focus sessions after breaks
                </div>
              </div>
              <Switch id="auto-focus" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-calendar" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="event-notifications">Event reminders</Label>
                <div className="text-sm text-muted-foreground">
                  Receive notifications before events start
                </div>
              </div>
              <Switch id="event-notifications" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="focus-notifications">Focus time alerts</Label>
                <div className="text-sm text-muted-foreground">
                  Receive notifications when focus sessions start and end
                </div>
              </div>
              <Switch id="focus-notifications" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="task-notifications">Task reminders</Label>
                <div className="text-sm text-muted-foreground">
                  Receive notifications for upcoming task deadlines
                </div>
              </div>
              <Switch id="task-notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-calendar" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your calendar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Color Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="w-full aspect-square bg-calendar rounded-md cursor-pointer ring-2 ring-calendar ring-offset-2" />
                  <div className="w-full aspect-square bg-blue-500 rounded-md cursor-pointer" />
                  <div className="w-full aspect-square bg-green-500 rounded-md cursor-pointer" />
                  <div className="w-full aspect-square bg-orange-500 rounded-md cursor-pointer" />
                  <div className="w-full aspect-square bg-red-500 rounded-md cursor-pointer" />
                  <div className="w-full aspect-square bg-gray-500 rounded-md cursor-pointer" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="view-density">View Density</Label>
                <select id="view-density" className="w-full p-2 rounded-md border border-input">
                  <option value="compact">Compact</option>
                  <option value="default" selected>Default</option>
                  <option value="relaxed">Relaxed</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-format">Time Format</Label>
                <select id="time-format" className="w-full p-2 rounded-md border border-input">
                  <option value="12" selected>12-hour (AM/PM)</option>
                  <option value="24">24-hour</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
