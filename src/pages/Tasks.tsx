
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
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock,
  CheckSquare,
  X,
  Star,
  StarOff
} from 'lucide-react';

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

  return (
    <div className="tasks-page">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Task List</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''}
              >
                All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFilter('active')}
                className={filter === 'active' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''}
              >
                Active
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFilter('completed')}
                className={filter === 'completed' ? 'bg-calendar text-white hover:bg-calendar-focus' : ''}
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
              className="mr-2"
            />
            <Button onClick={handleAddTask} className="bg-calendar hover:bg-calendar-focus">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          
          <div className="space-y-2">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`flex items-center justify-between p-3 rounded-md ${
                    task.completed ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox 
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => handleToggleComplete(task.id)}
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={`task-${task.id}`}
                        className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}
                      >
                        {task.title}
                      </label>
                      
                      {task.dueDate && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => handleTogglePriority(task.id)}
                    >
                      {task.priority === 'high' ? (
                        <Star className="h-4 w-4 text-yellow-500" />
                      ) : task.priority === 'medium' ? (
                        <Star className="h-4 w-4 text-gray-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <CheckSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">No tasks found</p>
                <p className="text-sm text-gray-400">
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
