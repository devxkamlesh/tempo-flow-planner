
import React, { useState } from 'react';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import DayView from '@/components/calendar/DayView';
import WeekView from '@/components/calendar/WeekView';
import MonthView from '@/components/calendar/MonthView';
import EventForm from '@/components/calendar/EventForm';
import { useCalendar } from '@/context/CalendarContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Calendar: React.FC = () => {
  const { view } = useCalendar();
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsEventFormOpen(true);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  const handleCloseEventForm = () => {
    setIsEventFormOpen(false);
    setEditingEvent(null);
  };

  return (
    <div className="calendar-page">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button 
          onClick={handleAddEvent} 
          className="bg-calendar hover:bg-calendar-focus rounded-full"
        >
          <PlusCircle className="h-4 w-4 mr-1" /> Add Event
        </Button>
      </div>
      
      <Card className="mb-6 shadow-sm border-gray-100">
        <CardContent className="p-3">
          <CalendarHeader onAddEvent={handleAddEvent} />
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-gray-100">
        <CardContent className="p-0 overflow-hidden">
          <div className="calendar-view-container">
            {view === 'day' && <DayView onEditEvent={handleEditEvent} />}
            {view === 'week' && <WeekView onEditEvent={handleEditEvent} />}
            {view === 'month' && <MonthView onEditEvent={handleEditEvent} />}
          </div>
        </CardContent>
      </Card>
      
      <EventForm 
        isOpen={isEventFormOpen} 
        onClose={handleCloseEventForm}
        editingEvent={editingEvent}
      />
    </div>
  );
};

export default Calendar;
