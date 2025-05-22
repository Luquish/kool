'use client';

import { useState, useEffect } from 'react';
import storage from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [strategy, setStrategy] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  // Obtener el usuario actual y su perfil
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await storage.getCurrentUser();
        setCurrentUser(user);
        
        if (user) {
          const profile = await storage.getUserProfile(user);
          setUserProfile(profile);
          
          // Comprobar si ya tiene una estrategia generada
          try {
            const strategyData = await fetch(`/api/storage?path=storage/${user}/strategy.json`);
            if (strategyData.ok) {
              const data = await strategyData.json();
              setStrategy(data.data);
            }
          } catch (error) {
            console.warn('No se encontró estrategia previa');
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

  // Cambiar estado de tarea
  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    if (!strategy || !currentUser) return;

    // Crear una copia profunda del objeto strategy
    const updatedStrategy = JSON.parse(JSON.stringify(strategy));
    
    // Actualizar el estado de la tarea en el task_tracker
    const taskIndex = updatedStrategy.task_tracker.findIndex((task: any) => task.id === taskId);
    
    if (taskIndex !== -1) {
      updatedStrategy.task_tracker[taskIndex].status = newStatus;
      
      // Actualizar el estado local
      setStrategy(updatedStrategy);
      
      // Guardar en el servidor
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
      <Breadcrumb 
        items={[{ href: '/dashboard', label: 'Dashboard' }]}
        className="mb-4" 
      />
      
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Mostrar botón si no hay estrategia */}
      {!strategy && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create your personalized strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Generate a personalized growth plan based on your artist profile.</p>
            <Button 
              onClick={handleGenerateStrategy} 
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Build Strategy'}
            </Button>
            
            {loading && (
              <div className="mt-4">
                <p className="mb-2">Generating your personalized strategy. This may take a minute...</p>
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
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="tasks">Task Tracker</TabsTrigger>
          </TabsList>
          
          {/* Pestaña de Calendario */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Action Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Goal</TableHead>
                      <TableHead>Budget</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {strategy?.calendar?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.channel}</TableCell>
                        <TableCell>{item.effort_hours}</TableCell>
                        <TableCell>{item.goal}</TableCell>
                        <TableCell>{item.budget_ars}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Responsible</TableHead>
                      <TableHead>Dependencies</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {strategy?.task_tracker?.map((task: any) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>
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
                                  Pending
                                </span>
                              </SelectItem>
                              <SelectItem value="in-progress">
                                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                  In progress
                                </span>
                              </SelectItem>
                              <SelectItem value="done">
                                <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                  Completed
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{task.owner}</TableCell>
                        <TableCell>{task.dependencies?.join(', ') || 'None'}</TableCell>
                      </TableRow>
                    ))}
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
