import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Card, CardContent } from './ui/card';
import { Plus, LogOut, CheckCircle2, Circle, Trash2, Edit, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = ({ user, logout }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'all', priority: 'all' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: null,
    priority: 'medium'
  });

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filter]);

  const loadTasks = async () => {
    try {
      const response = await axios.get(`${API}/tasks`, { withCredentials: true });
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Error al cargar tareas');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    if (filter.status !== 'all') {
      filtered = filtered.filter(task => task.status === filter.status);
    }

    if (filter.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filter.priority);
    }

    setFilteredTasks(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    try {
      if (editingTask) {
        await axios.put(
          `${API}/tasks/${editingTask.id}`,
          formData,
          { withCredentials: true }
        );
        toast.success('Tarea actualizada');
      } else {
        await axios.post(
          `${API}/tasks`,
          formData,
          { withCredentials: true }
        );
        toast.success('Tarea creada');
      }

      loadTasks();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Error al guardar tarea');
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await axios.put(
        `${API}/tasks/${task.id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      loadTasks();
      toast.success(newStatus === 'completed' ? '¡Tarea completada!' : 'Tarea marcada como pendiente');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error al actualizar tarea');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API}/tasks/${taskId}`, { withCredentials: true });
      loadTasks();
      toast.success('Tarea eliminada');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error al eliminar tarea');
    }
  };

  const openEditDialog = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      due_date: task.due_date ? new Date(task.due_date) : null,
      priority: task.priority
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      due_date: null,
      priority: 'medium'
    });
    setEditingTask(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'from-red-500 to-orange-500';
      case 'medium':
        return 'from-yellow-500 to-amber-500';
      case 'low':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority;
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md shadow-sm border-b border-purple-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="text-white" size={24} />
            </div>
            <h1 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              data-testid="dashboard-title"
            >
              Mis Tareas
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.picture} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700" data-testid="user-name">{user?.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
              data-testid="logout-button"
            >
              <LogOut size={16} className="mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg" data-testid="stats-total">
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-2">{stats.total}</div>
              <div className="text-blue-100">Total de Tareas</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg" data-testid="stats-completed">
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-2">{stats.completed}</div>
              <div className="text-green-100">Completadas</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg" data-testid="stats-pending">
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-2">{stats.pending}</div>
              <div className="text-orange-100">Pendientes</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Select value={filter.status} onValueChange={(value) => setFilter({ ...filter, status: value })}>
            <SelectTrigger className="w-[180px] bg-white" data-testid="filter-status">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="completed">Completadas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filter.priority} onValueChange={(value) => setFilter({ ...filter, priority: value })}>
            <SelectTrigger className="w-[180px] bg-white" data-testid="filter-priority">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button 
                className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                data-testid="add-task-button"
              >
                <Plus size={20} className="mr-2" />
                Nueva Tarea
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]" data-testid="task-dialog">
              <DialogHeader>
                <DialogTitle>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
                <DialogDescription>
                  {editingTask ? 'Modifica los detalles de la tarea' : 'Crea una nueva tarea'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Título *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Completar proyecto"
                    required
                    data-testid="task-title-input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Descripción</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detalles de la tarea..."
                    rows={3}
                    data-testid="task-description-input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Prioridad</label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger data-testid="task-priority-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Fecha Límite</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        data-testid="task-date-picker-trigger"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.due_date ? format(formData.due_date, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.due_date}
                        onSelect={(date) => setFormData({ ...formData, due_date: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600" data-testid="task-submit-button">
                    {editingTask ? 'Actualizar' : 'Crear'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => { setIsDialogOpen(false); resetForm(); }}
                    data-testid="task-cancel-button"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm p-12 text-center" data-testid="empty-tasks-message">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">No hay tareas que mostrar</p>
            <p className="text-gray-400 text-sm mt-2">Crea tu primera tarea para comenzar</p>
          </Card>
        ) : (
          <div className="grid gap-4" data-testid="tasks-list">
            {filteredTasks.map((task) => (
              <Card 
                key={task.id} 
                className={`bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 ${task.status === 'completed' ? 'opacity-75' : ''}`}
                data-testid={`task-card-${task.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className="mt-1 flex-shrink-0"
                      data-testid={`task-toggle-${task.id}`}
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="text-green-600" size={24} />
                      ) : (
                        <Circle className="text-gray-400 hover:text-purple-600 transition-colors" size={24} />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 
                            className={`text-lg font-semibold mb-2 ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}
                            data-testid={`task-title-${task.id}`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-gray-600 text-sm mb-3" data-testid={`task-description-${task.id}`}>{task.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getPriorityColor(task.priority)}`} data-testid={`task-priority-${task.id}`}>
                              {getPriorityLabel(task.priority)}
                            </span>
                            {task.due_date && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1" data-testid={`task-due-date-${task.id}`}>
                                <CalendarIcon size={12} />
                                {format(new Date(task.due_date), 'PP', { locale: es })}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(task)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                            data-testid={`task-edit-${task.id}`}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                            data-testid={`task-delete-${task.id}`}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;