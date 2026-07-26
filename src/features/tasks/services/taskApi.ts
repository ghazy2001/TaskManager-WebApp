import axiosInstance from '../../../config/axiosInstance';
import type { Task, CreateTaskDto, UpdateTaskDto, TaskPriority, TaskStatus } from '../types/task.types';

const STORAGE_KEY = 'taskflow_tasks';

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Primary Color Palette Design',
    description: 'Select colors reflecting modernity and professionalism, compliant with WCAG accessibility guidelines.',
    priority: 'High',
    status: 'Todo',
    dueDate: '2026-10-26',
    projectId: 'proj-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Market Trend Research',
    description: 'Study competitors in the tech sector and analyze the most successful visual trends.',
    priority: 'Low',
    status: 'Done',
    dueDate: '2026-10-20',
    projectId: 'proj-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Logo Prototyping',
    description: 'Begin sketching and move to digital prototypes for three different logo concepts.',
    priority: 'High',
    status: 'InProgress',
    dueDate: '2026-10-28',
    projectId: 'proj-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'User Persona Mapping',
    description: 'Define customer and driver profiles to detail target user flows.',
    priority: 'Medium',
    status: 'Done',
    dueDate: '2026-10-15',
    projectId: 'proj-2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Interactive Map Wireframes',
    description: 'Draft screen interactions for delivery route tracking.',
    priority: 'High',
    status: 'InProgress',
    dueDate: '2026-10-27',
    projectId: 'proj-2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-6',
    title: 'Push Notification Schema',
    description: 'Define standard triggers and copy for delivery progress alerts.',
    priority: 'Low',
    status: 'Todo',
    dueDate: '2026-11-02',
    projectId: 'proj-2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-7',
    title: 'Keyword Research & Strategy',
    description: 'Identify high-value search terms for catalog page ranking.',
    priority: 'High',
    status: 'Done',
    dueDate: '2026-10-10',
    projectId: 'proj-3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-8',
    title: 'Meta Description Rewrites',
    description: 'Update title tags and snippets for top 50 conversion pages.',
    priority: 'Medium',
    status: 'Todo',
    dueDate: '2026-11-15',
    projectId: 'proj-3',
    createdAt: new Date().toISOString(),
  }
];

const getStoredTasks = (): Task[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
    return INITIAL_TASKS;
  }
  return JSON.parse(data);
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const normalizePriority = (p: any): TaskPriority => {
  if (p === 0 || p === 'Low' || p === 'low') return 'Low';
  if (p === 1 || p === 'Medium' || p === 'medium') return 'Medium';
  if (p === 2 || p === 'High' || p === 'high') return 'High';
  return 'Medium';
};

const normalizeStatus = (s: any): TaskStatus => {
  if (s === 0 || s === 'Todo' || s === 'todo') return 'Todo';
  if (s === 1 || s === 'InProgress' || s === 'inprogress' || s === 'In Progress') return 'InProgress';
  if (s === 2 || s === 'Done' || s === 'done' || s === 'Completed') return 'Done';
  return 'Todo';
};

const normalizeTask = (t: any, defaultProjectId?: string): Task => {
  return {
    id: String(t.id || t.taskId || t.Id || `task-${Date.now()}`),
    title: t.title || t.Title || t.name || t.Name || 'Untitled Task',
    description: t.description || t.Description || '',
    priority: normalizePriority(t.priority || t.Priority),
    status: normalizeStatus(t.status || t.Status),
    dueDate: t.dueDate || t.DueDate,
    projectId: String(t.projectId || t.ProjectId || defaultProjectId || ''),
    createdAt: t.createdAt || t.CreatedAt || new Date().toISOString(),
  };
};

export const taskApi = {
  getByProjectId: async (projectId: string): Promise<Task[]> => {
    try {
      // Try GET /Tasks?projectId=... or GET /Projects/{projectId}/tasks
      let response;
      try {
        response = await axiosInstance.get(`/Tasks`, { params: { projectId } });
      } catch {
        response = await axiosInstance.get(`/Projects/${projectId}/tasks`);
      }
      if (Array.isArray(response.data)) {
        return response.data.map(t => normalizeTask(t, projectId));
      }
    } catch (error) {
      console.warn(`Backend /Tasks API endpoint for project ${projectId} not reachable yet, using fallback client:`, error);
    }
    const tasks = getStoredTasks();
    return tasks.filter(t => String(t.projectId) === String(projectId));
  },

  getById: async (id: string): Promise<Task> => {
    try {
      const response = await axiosInstance.get(`/Tasks/${id}`);
      if (response.data) {
        return normalizeTask(response.data);
      }
    } catch (error) {
      console.warn(`Backend /Tasks/${id} API endpoint not reachable yet, using fallback client:`, error);
    }
    const tasks = getStoredTasks();
    const task = tasks.find(t => String(t.id) === String(id));
    if (!task) throw new Error('Task not found');
    return task;
  },

  create: async (data: CreateTaskDto): Promise<Task> => {
    try {
      const response = await axiosInstance.post('/Tasks', data);
      if (response.data) {
        return normalizeTask(response.data, data.projectId);
      }
    } catch (error) {
      console.warn('Backend POST /Tasks API endpoint not reachable yet, saving locally:', error);
    }
    const tasks = getStoredTasks();
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title,
      description: data.description || '',
      priority: data.priority || 'Medium',
      status: data.status || 'Todo',
      dueDate: data.dueDate,
      projectId: data.projectId,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    saveTasks(tasks);
    return newTask;
  },

  update: async (id: string, data: UpdateTaskDto): Promise<Task> => {
    try {
      const response = await axiosInstance.put(`/Tasks/${id}`, { id, ...data });
      if (response.data) {
        return normalizeTask(response.data);
      }
    } catch (error) {
      console.warn(`Backend PUT /Tasks/${id} API endpoint not reachable yet, updating locally:`, error);
    }
    const tasks = getStoredTasks();
    const index = tasks.findIndex(t => String(t.id) === String(id));
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = {
      ...tasks[index],
      ...data,
    };
    saveTasks(tasks);
    return tasks[index];
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/Tasks/${id}`);
    } catch (error) {
      console.warn(`Backend DELETE /Tasks/${id} API endpoint not reachable yet, deleting locally:`, error);
    }
    let tasks = getStoredTasks();
    tasks = tasks.filter(t => String(t.id) !== String(id));
    saveTasks(tasks);
  },
};
