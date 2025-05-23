'use client';

import { useState, useEffect, useRef } from 'react';
import storage from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { OnboardingModal } from "@/components/ui/onboarding-modal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from 'react';

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  channel: 'IG/TikTok' | 'YT' | 'Live' | 'Email' | 'Other';
  effort_hours: number;
  goal: 'brand' | 'engagement' | 'conversion' | 'data-driven';
  budget: number;
}

interface TaskTracker {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'done';
  owner: string;
  dependencies: string[];
}

interface Strategy {
  calendar: CalendarEvent[];
  task_tracker: TaskTracker[];
}

interface TaskWithExpanded extends TaskTracker {
  isExpanded?: boolean;
}

// Definir colores para cada canal
const channelColors: Record<CalendarEvent['channel'], string> = {
  'IG/TikTok': 'bg-purple-100 text-purple-800',
  'YT': 'bg-red-100 text-red-800',
  'Live': 'bg-blue-100 text-blue-800',
  'Email': 'bg-green-100 text-green-800',
  'Other': 'bg-gray-100 text-gray-800'
};

// Definir colores para cada objetivo
const goalColors: Record<CalendarEvent['goal'], string> = {
  'brand': 'bg-indigo-100 text-indigo-800',
  'engagement': 'bg-pink-100 text-pink-800',
  'conversion': 'bg-orange-100 text-orange-800',
  'data-driven': 'bg-cyan-100 text-cyan-800'
};

// Definir colores para estados de tareas
const taskStatusColors = {
  'pending': 'bg-white',
  'in-progress': 'bg-blue-50',
  'done': 'bg-green-50'
} as const;

// Componente de día del calendario
const CalendarDay = ({ 
  day, 
  events, 
  onEventClick,
  strategy 
}: { 
  day: Date, 
  events: CalendarEvent[], 
  onEventClick: (taskId: string) => void,
  strategy: Strategy
}) => {
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const isSameDay = 
      eventDate.getDate() === day.getDate() &&
      eventDate.getMonth() === day.getMonth() &&
      eventDate.getFullYear() === day.getFullYear();
    return isSameDay;
  });

  return (
    <div className={cn(
      "min-h-[120px] border p-2",
      dayEvents.length > 0 ? "bg-white" : "bg-gray-50"
    )}>
      <div className="font-semibold mb-2">{day.getDate()}</div>
      <div className="space-y-1">
        {dayEvents.map((event, idx) => {
          const taskStatus = strategy.task_tracker.find(task => task.id === event.id)?.status || 'pending';
          
          return (
            <div 
              key={idx} 
              className={cn(
                "text-xs p-1 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer",
                taskStatusColors[taskStatus]
              )}
              onClick={() => onEventClick(event.id)}
            >
              <div className="font-medium mb-1 truncate" title={event.title}>{event.title}</div>
              <div className="flex flex-wrap gap-1">
                <Badge className={cn("text-[10px]", channelColors[event.channel])}>
                  {event.channel}
                </Badge>
                <Badge className={cn("text-[10px]", goalColors[event.goal])}>
                  {event.goal}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Componente del calendario
const Calendar = ({ 
  events, 
  onEventClick,
  strategy 
}: { 
  events: CalendarEvent[], 
  onEventClick: (taskId: string) => void,
  strategy: Strategy
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 1));
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const days = getDaysInMonth(currentDate);
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startingDayIndex = firstDayOfMonth.getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={previousMonth}>&lt;</Button>
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
        </h2>
        <Button variant="outline" onClick={nextMonth}>&gt;</Button>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekDays.map(day => (
          <div key={day} className="bg-gray-50 p-2 text-center font-medium">
            {day}
          </div>
        ))}
        
        {Array.from({ length: startingDayIndex }).map((_, idx) => (
          <div key={`empty-start-${idx}`} className="bg-gray-50 min-h-[120px] border p-2" />
        ))}
        
        {days.map(day => (
          <CalendarDay 
            key={day.toISOString()} 
            day={day} 
            events={events}
            onEventClick={onEventClick}
            strategy={strategy}
          />
        ))}
        
        {Array.from({ length: (7 - ((days.length + startingDayIndex) % 7)) % 7 }).map((_, idx) => (
          <div key={`empty-end-${idx}`} className="bg-gray-50 min-h-[120px] border p-2" />
        ))}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const taskListRef = useRef<HTMLDivElement>(null);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await storage.getCurrentUser();
        setCurrentUser(user);
        
        if (user) {
          const profile = await storage.getUserProfile(user);
          setUserProfile(profile);
          
          if (!profile?.isOnboardingCompleted) {
            setShowOnboardingModal(true);
            return;
          }
          
          try {
            const strategyData = await fetch(`/api/storage?path=storage/${user}/strategy.json`);
            if (strategyData.ok) {
              const data = await strategyData.json();
              console.log('Datos de estrategia cargados:', data);
              if (data.data?.calendar) {
                const formattedCalendar = data.data.calendar.map((event: any) => ({
                  ...event,
                  date: new Date(event.date).toISOString()
                }));
                setStrategy({
                  ...data.data,
                  calendar: formattedCalendar
                });
              }
            }
          } catch (error) {
            console.warn('No se encontró estrategia previa:', error);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      }
    };
    
    fetchUserData();
  }, []);

  // Generar estrategia
  const handleGenerateStrategy = async () => {
    if (!currentUser || !userProfile) {
      toast({
        title: 'Error',
        description: 'No se pudo obtener el perfil del usuario',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: currentUser,
          profileData: userProfile
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al generar estrategia');
      }
      
      const data = await response.json();
      setStrategy(data.strategy);
      
      toast({
        title: 'Éxito',
        description: 'Estrategia generada correctamente',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error al generar estrategia:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar la estrategia',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  // Calcular progreso del task tracker
  const calculateProgress = () => {
    if (!strategy || !strategy.task_tracker) return 0;
    
    const totalTasks = strategy.task_tracker.length;
    const completedTasks = strategy.task_tracker.filter((task: any) => task.status === 'done').length;
    
    return (completedTasks / totalTasks) * 100;
  };

  const handleEventClick = (taskId: string) => {
    const taskElement = document.getElementById(`task-${taskId}`);
    if (taskElement) {
      taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    if (!strategy || !currentUser) return;

    const updatedStrategy = JSON.parse(JSON.stringify(strategy));
    const taskIndex = updatedStrategy.task_tracker.findIndex((task: any) => task.id === taskId);
    
    if (taskIndex !== -1) {
      updatedStrategy.task_tracker[taskIndex].status = newStatus;
      setStrategy(updatedStrategy);
      
      try {
        await fetch('/api/storage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: `storage/${currentUser}/strategy.json`,
            data: updatedStrategy
          }),
        });
        
        toast({
          title: 'Actualizado',
          description: 'Estado de la tarea actualizado correctamente',
          variant: 'default'
        });
      } catch (error) {
        console.error('Error al guardar estado de tarea:', error);
        toast({
          title: 'Error',
          description: 'No se pudo actualizar el estado de la tarea',
          variant: 'destructive'
        });
      }
    }
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Si no hay usuario, mostrar mensaje
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>You are not logged in</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to access the dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <OnboardingModal isOpen={showOnboardingModal} />
      
      <Breadcrumb 
        items={[{ href: '/dashboard', label: 'Dashboard' }]}
        className="mb-4" 
      />
      
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Mostrar botón si no hay estrategia */}
      {!strategy && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Crear tu estrategia personalizada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Genera un plan de crecimiento personalizado basado en tu perfil de artista.</p>
            <Button 
              onClick={handleGenerateStrategy} 
              disabled={loading}
            >
              {loading ? 'Generando...' : 'Construir Estrategia'}
            </Button>
            
            {loading && (
              <div className="mt-4">
                <p className="mb-2">Generando tu estrategia personalizada. Esto puede tomar un minuto...</p>
                <Progress value={undefined} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Mostrar estrategia si existe */}
      {strategy && (
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="calendar">Task Calendar</TabsTrigger>
            <TabsTrigger value="tasks">Task Tracker</TabsTrigger>
          </TabsList>
          
          {/* Pestaña de Calendario */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Task Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar 
                  events={strategy.calendar} 
                  onEventClick={handleEventClick}
                  strategy={strategy}
                />
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Task Calendar</h3>
                  <ScrollArea className="h-[400px] rounded-md border">
                    <div className="p-4 space-y-4" ref={taskListRef}>
                      {strategy.task_tracker.map((task: any) => {
                        const calendarEvent = strategy.calendar.find(event => event.id === task.id);
                        const eventDate = calendarEvent ? new Date(calendarEvent.date) : null;
                        const formattedDate = eventDate ? `${(eventDate.getMonth() + 1).toString().padStart(2, '0')}/${eventDate.getDate().toString().padStart(2, '0')}` : '';
                        
                        return (
                          <div key={task.id} className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                              {task.dependencies.length > 0 && (
                                <div className="text-sm text-gray-500">
                                  {task.dependencies.length === 1 ? 'Depends on task' : 'Depends on tasks'}: {task.dependencies.map((depId: string, index: number) => {
                                    const taskNumber = strategy.task_tracker.findIndex((t: any) => t.id === depId) + 1;
                                    return `${taskNumber}${index < task.dependencies.length - 1 ? ', ' : ''}`;
                                  })}
                                </div>
                              )}
                              <div className="text-sm font-medium text-gray-500">
                                {formattedDate}
                              </div>
                            </div>
                            <div
                              id={`task-${task.id}`}
                              className={cn(
                                "p-4 rounded-lg border",
                                taskStatusColors[task.status as keyof typeof taskStatusColors]
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{task.title}</h4>
                                <Select
                                  value={task.status}
                                  onValueChange={(value) => handleTaskStatusChange(task.id, value)}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Estado" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">
                                      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                                        Pendiente
                                      </span>
                                    </SelectItem>
                                    <SelectItem value="in-progress">
                                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                        En progreso
                                      </span>
                                    </SelectItem>
                                    <SelectItem value="done">
                                      <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                        Completado
                                      </span>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pestaña de Task Tracker */}
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Task Tracker</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">{calculateProgress().toFixed(0)}% completed</span>
                    <Progress value={calculateProgress()} className="w-[200px] h-2" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]"></TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Responsible</TableHead>
                      <TableHead>Dependencies</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {strategy?.task_tracker?.map((task: any) => {
                      const calendarEvent = strategy.calendar.find(event => event.id === task.id);
                      const isExpanded = expandedTasks[task.id];

                      return (
                        <React.Fragment key={task.id}>
                          <TableRow className="cursor-pointer" onClick={() => toggleTaskExpansion(task.id)}>
                            <TableCell>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>
                              <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                <Select
                                  defaultValue={task.status}
                                  onValueChange={(value) => handleTaskStatusChange(task.id, value)}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">
                                      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                                        Pendiente
                                      </span>
                                    </SelectItem>
                                    <SelectItem value="in-progress">
                                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                        En progreso
                                      </span>
                                    </SelectItem>
                                    <SelectItem value="done">
                                      <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                        Completado
                                      </span>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell>{task.owner}</TableCell>
                            <TableCell>{task.dependencies?.join(', ') || 'None'}</TableCell>
                          </TableRow>
                          {isExpanded && calendarEvent && (
                            <TableRow>
                              <TableCell colSpan={5} className="bg-gray-50">
                                <div className="p-4 space-y-2">
                                  <div>
                                    <span className="font-semibold">Description:</span> {calendarEvent.description}
                                  </div>
                                  <div className="flex gap-8">
                                    <div>
                                      <span className="font-semibold">Channel:</span>{' '}
                                      <Badge className={channelColors[calendarEvent.channel]}>
                                        {calendarEvent.channel}
                                      </Badge>
                                    </div>
                                    <div>
                                      <span className="font-semibold">Objective:</span>{' '}
                                      <Badge className={goalColors[calendarEvent.goal]}>
                                        {calendarEvent.goal}
                                      </Badge>
                                    </div>
                                    <div>
                                      <span className="font-semibold">Estimated hours:</span>{' '}
                                      {calendarEvent.effort_hours}h
                                    </div>
                                    <div>
                                      <span className="font-semibold">Budget:</span>{' '}
                                      {calendarEvent.budget}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
