
import React, { useState } from 'react';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import DayView from '@/components/calendar/DayView';
import WeekView from '@/components/calendar/WeekView';
import MonthView from '@/components/calendar/MonthView';
import EventForm from '@/components/calendar/EventForm';
import { useCalendar } from '@/context/CalendarContext';

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
      <CalendarHeader onAddEvent={handleAddEvent} />
      
      <div className="calendar-view-container">
        {view === 'day' && <DayView />}
        {view === 'week' && <WeekView />}
        {view === 'month' && <MonthView />}
      </div>
      
      <EventForm 
        isOpen={isEventFormOpen} 
        onClose={handleCloseEventForm}
        editingEvent={editingEvent}
      />
    </div>
  );
};

export default Calendar;
