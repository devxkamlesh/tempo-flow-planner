
import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useCalendar } from '@/context/CalendarContext';
import { format } from 'date-fns';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingEvent?: any;
}

const EventForm: React.FC<EventFormProps> = ({ isOpen, onClose, editingEvent }) => {
  const { addEvent, editEvent, selectedDate } = useCalendar();
  
  // Initialize form with default values or editing event values
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: editingEvent || {
      title: '',
      type: 'work',
      start: format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
      end: format(new Date(selectedDate.getTime() + 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
      location: '',
      description: ''
    }
  });

  React.useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        // Format dates for input elements
        setValue('start', format(new Date(editingEvent.start), "yyyy-MM-dd'T'HH:mm"));
        setValue('end', format(new Date(editingEvent.end), "yyyy-MM-dd'T'HH:mm"));
      } else {
        reset({
          title: '',
          type: 'work',
          start: format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
          end: format(new Date(selectedDate.getTime() + 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
          location: '',
          description: ''
        });
      }
    }
  }, [isOpen, editingEvent, selectedDate, reset, setValue]);

  const onSubmit = (data: any) => {
    const eventData = {
      ...data,
      start: new Date(data.start),
      end: new Date(data.end),
      type: data.type || 'work'
    };

    if (editingEvent) {
      editEvent({ ...eventData, id: editingEvent.id });
    } else {
      addEvent(eventData);
    }
    
    onClose();
  };

  const handleTypeChange = (value: string) => {
    setValue('type', value as 'work' | 'personal' | 'focus' | 'other');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="Enter event title"
              {...register('title', { required: true })}
            />
            {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start Time</Label>
              <Input
                id="start"
                type="datetime-local"
                {...register('start', { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End Time</Label>
              <Input
                id="end"
                type="datetime-local"
                {...register('end', { required: true })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <Select onValueChange={handleTypeChange} defaultValue={editingEvent?.type || 'work'}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="focus">Focus Time</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              placeholder="Enter location"
              {...register('location')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              {...register('description')}
            />
          </div>
          
          <input type="hidden" {...register('type')} />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-calendar hover:bg-calendar-focus">
              {editingEvent ? 'Update Event' : 'Add Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
