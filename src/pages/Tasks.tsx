import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock,
  CheckSquare,
  X,
  Star,
  StarOff,
  Edit,
  Trash2,
  CheckCheck,
  AlertCircle,
  Clock3,
  ListTodo,
  FileText,
  Tag,
  CalendarDays,
  ListChecks
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCalendar } from '@/context/CalendarContext';
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from 'date-fns';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  notes?: string;
  eventId?: string;
}

const Tasks: React.FC = () => {
  const { events, addEvent, editEvent, removeEvent } = useCalendar();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
  
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Error parsing tasks from localStorage:", e);
        setTasks([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const taskEventIds = tasks.filter(task => task.eventId).map(task => task.eventId);
    
    const newEvents = events.filter(event => 
      !taskEventIds.includes(event.id)
    );
    
    if (newEvents.length > 0) {
      const newTasks = newEvents.map(event => {
        return {
          id: `task-${event.id}`,
          title: event.title,
          completed: false,
          priority: mapEventTypeToPriority(event.type),
          dueDate: format(event.start, 'yyyy-MM-dd'),
          notes: event.description || undefined,
          eventId: event.id
        };
      });
      
      setTasks(prev => [...prev, ...newTasks]);
      toast({
        title: "Calendar Sync",
        description: `${newEvents.length} events added to tasks.`,
      });
    }
  }, [events]);

  const mapEventTypeToPriority = (type: string): 'high' | 'medium' | 'low' => {
    switch (type) {
      case 'work': return 'high';
      case 'focus': return 'medium';
      case 'personal': return 'low';
      default: return 'medium';
    }
  };

  const mapPriorityToEventType = (priority: 'high' | 'medium' | 'low'): string => {
    switch (priority) {
      case 'high': return 'work';
      case 'medium': return 'focus';
      case 'low': return 'personal';
      default: return 'other';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    return !task.completed;
  });

  const simpleTasks = filteredTasks.filter(task => !task.dueDate);
  const complexTasks = filteredTasks.filter(task => task.dueDate);

  const handleAddTask = () => {
    if (newTaskText.trim() === '') return;
    
    const newTask: Task = {
      id: `task-${Date.now().toString()}`,
      title: newTaskText,
      completed: false,
      priority: 'medium'
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleTogglePriority = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
        const currentIndex = priorities.indexOf(task.priority);
        const nextIndex = (currentIndex + 1) % priorities.length;
        const newPriority = priorities[nextIndex];
        
        if (task.eventId) {
          const associatedEvent = events.find(event => event.id === task.eventId);
          if (associatedEvent) {
            editEvent({
              ...associatedEvent,
              type: mapPriorityToEventType(newPriority)
            });
          }
        }
        
        return { ...task, priority: newPriority };
      }
      return task;
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    
    if (taskToDelete?.eventId) {
      removeEvent(taskToDelete.eventId);
    }
    
    setTasks(tasks.filter(task => task.id !== taskId));
    
    toast({
      title: "Task Deleted",
      description: "The task has been removed successfully."
    });
  };

  const handleAddToCalendar = (task: Task) => {
    if (!task.dueDate) {
      toast({
        title: "Cannot Add to Calendar",
        description: "This task doesn't have a due date.",
        variant: "destructive"
      });
      return;
    }
    
    if (task.eventId) {
      toast({
        title: "Already in Calendar",
        description: "This task is already linked to a calendar event."
      });
      return;
    }
    
    const dueDate = new Date(task.dueDate);
    const endTime = new Date(dueDate);
    endTime.setHours(endTime.getHours() + 1);
    
    const newEvent = {
      title: task.title,
      start: dueDate,
      end: endTime,
      type: mapPriorityToEventType(task.priority),
      description: task.notes,
      location: ""
    };
    
    addEvent(newEvent);
    
    const createdEvent = events[events.length - 1];
    
    setTasks(tasks.map(t => 
      t.id === task.id ? { ...t, eventId: createdEvent.id } : t
    ));
    
    toast({
      title: "Added to Calendar",
      description: "Task has been added to your calendar."
    });
  };

  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock3 className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <Star className="h-4 w-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {getPriorityIcon(priority)}
            <span className="ml-1">High</span>
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {getPriorityIcon(priority)}
            <span className="ml-1">Medium</span>
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {getPriorityIcon(priority)}
            <span className="ml-1">Low</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  const getDaysRemaining = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const renderDueDateBadge = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const daysRemaining = getDaysRemaining(dueDate);
    if (daysRemaining === null) return null;
    
    if (daysRemaining < 0) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <Clock className="h-3 w-3 mr-1" />
          Overdue by {Math.abs(daysRemaining)} {Math.abs(daysRemaining) === 1 ? 'day' : 'days'}
        </Badge>
      );
    }
    
    if (daysRemaining === 0) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <Clock className="h-3 w-3 mr-1" />
          Due today
        </Badge>
      );
    }
    
    if (daysRemaining <= 2) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <Clock className="h-3 w-3 mr-1" />
          Due in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <Clock className="h-3 w-3 mr-1" />
        Due in {daysRemaining} days
      </Badge>
    );
  };

  const renderTaskItem = (task: Task) => (
    <div 
      key={task.id} 
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all",
        task.completed 
          ? "bg-gray-50 border-gray-100" 
          : task.priority === 'high'
            ? "bg-white border-red-100 shadow-sm" 
            : task.priority === 'medium'
              ? "bg-white border-amber-100 shadow-sm"
              : "bg-white border-blue-100 shadow-sm",
        "hover:shadow-md"
      )}
    >
      <div className="flex items-start sm:items-center gap-3 flex-1">
        <div className="pt-1 sm:pt-0">
          <Checkbox 
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => handleToggleComplete(task.id)}
            className={cn(
              task.completed 
                ? "border-green-500 text-green-500" 
                : task.priority === 'high'
                  ? "border-red-500 text-red-500"
                  : task.priority === 'medium'
                    ? "border-amber-500 text-amber-500"
                    : "border-blue-500 text-blue-500"
            )}
          />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-start flex-wrap gap-2">
            <label 
              htmlFor={`task-${task.id}`}
              className={cn(
                "text-sm font-medium",
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              )}
            >
              {task.title}
            </label>
            
            {task.eventId && (
              <Badge variant="outline" className="bg-calendar-50 text-calendar-700 border-calendar-200">
                <CalendarIcon className="h-3 w-3 mr-1" />
                Calendar
              </Badge>
            )}
            
            {!task.completed && task.dueDate && renderDueDateBadge(task.dueDate)}
            {!task.completed && getPriorityBadge(task.priority)}
          </div>
          
          {task.notes && (
            <div className="flex items-center text-xs text-gray-500">
              <FileText className="h-3 w-3 mr-1" />
              {task.notes}
            </div>
          )}
          
          {task.dueDate && (
            <div className="flex items-center text-xs text-gray-500">
              <CalendarIcon className="h-3 w-3 mr-1" />
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1 mt-2 sm:mt-0">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-500 hover:text-calendar"
          onClick={() => handleTogglePriority(task.id)}
          title={`Priority: ${task.priority}`}
        >
          {getPriorityIcon(task.priority)}
        </Button>
        
        {task.dueDate && !task.eventId && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:text-calendar"
            onClick={() => handleAddToCalendar(task)}
            title="Add to Calendar"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-500 hover:text-amber-500"
          title="Edit task"
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-500 hover:text-red-500"
          onClick={() => handleDeleteTask(task.id)}
          title="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderNoTasksMessage = (type: string) => (
    <div className="py-10 text-center bg-gray-50 rounded-xl border border-gray-100">
      <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-700 font-medium">No {type} tasks found</p>
      <p className="text-sm text-gray-500 mt-1">
        {filter === 'all' 
          ? `Add some ${type} tasks to get started!` 
          : filter === 'completed' 
            ? `You haven't completed any ${type} tasks yet.` 
            : `All ${type} tasks are completed!`}
      </p>
    </div>
  );

  return (
    <div className="tasks-page">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      
      <Card className="mb-6 shadow-sm border-gray-100">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ListTodo className="h-5 w-5 mr-2 text-calendar" />
              Add New Task
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <Input
              placeholder="Add a new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              className="mr-2 rounded-full"
            />
            <Button onClick={handleAddTask} className="bg-calendar hover:bg-calendar-focus rounded-full">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filter Tasks</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFilter('all')}
            className={cn(
              "rounded-full px-4",
              filter === 'all' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''
            )}
          >
            All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFilter('active')}
            className={cn(
              "rounded-full px-4",
              filter === 'active' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''
            )}
          >
            Active
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFilter('completed')}
            className={cn(
              "rounded-full px-4",
              filter === 'completed' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''
            )}
          >
            Completed
          </Button>
        </div>
      </div>
      
      <Card className="mb-6 shadow-sm border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <ListChecks className="h-5 w-5 mr-2 text-blue-500" />
            Simple Tasks
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
              {simpleTasks.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {simpleTasks.length > 0 ? 
              simpleTasks.map(renderTaskItem) : 
              renderNoTasksMessage('simple')
            }
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6 shadow-sm border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <CalendarDays className="h-5 w-5 mr-2 text-amber-500" />
            Scheduled Tasks
            <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700">
              {complexTasks.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complexTasks.length > 0 ? 
              complexTasks.map(renderTaskItem) : 
              renderNoTasksMessage('scheduled')
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
