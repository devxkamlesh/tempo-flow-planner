
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  notes?: string;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete quarterly report',
    completed: false,
    priority: 'high',
    dueDate: '2025-04-10',
    notes: 'Include sales forecast and marketing analysis'
  },
  {
    id: '2',
    title: 'Review team project plan',
    completed: false,
    priority: 'medium',
    dueDate: '2025-04-08'
  },
  {
    id: '3',
    title: 'Prepare for client meeting',
    completed: false,
    priority: 'low',
    dueDate: '2025-04-05'
  },
  {
    id: '4',
    title: 'Update portfolio website',
    completed: true,
    priority: 'medium'
  },
  {
    id: '5',
    title: 'Send follow-up emails',
    completed: false,
    priority: 'medium',
    dueDate: '2025-04-07'
  }
];

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    return !task.completed;
  });

  const handleAddTask = () => {
    if (newTaskText.trim() === '') return;
    
    const newTask: Task = {
      id: Date.now().toString(),
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
        return { ...task, priority: priorities[nextIndex] };
      }
      return task;
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
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

  return (
    <div className="tasks-page">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      
      <Card className="mb-6 shadow-sm border-gray-100">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ListTodo className="h-5 w-5 mr-2 text-calendar" />
              Task List
            </CardTitle>
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
          
          <div className="space-y-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
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
              ))
            ) : (
              <div className="py-10 text-center bg-gray-50 rounded-xl border border-gray-100">
                <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">No tasks found</p>
                <p className="text-sm text-gray-500 mt-1">
                  {filter === 'all' 
                    ? 'Add some tasks to get started!' 
                    : filter === 'completed' 
                      ? 'You haven\'t completed any tasks yet.' 
                      : 'All tasks are completed!'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
