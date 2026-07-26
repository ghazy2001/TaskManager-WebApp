import type { Task, CreateTaskDto, UpdateTaskDto } from '../types/task.types';

const STORAGE_KEY = 'taskflow_tasks';

const INITIAL_TASKS: Task[] = [
  // Neo-Tech Branding Identity (proj-1)
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
  
  // Smart Delivery App (proj-2)
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

  // SEO Optimization Campaign (proj-3)
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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

export const taskApi = {
  getByProjectId: async (projectId: string): Promise<Task[]> => {
    await delay(300);
    const tasks = getStoredTasks();
    return tasks.filter(t => t.projectId === projectId);
  },

  getById: async (id: string): Promise<Task> => {
    await delay(200);
    const tasks = getStoredTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    return task;
  },

  create: async (data: CreateTaskDto): Promise<Task> => {
    await delay(400);
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
    
    // Invalidate project list cache counts by updating dummy project timestamp (optional trigger)
    return newTask;
  },

  update: async (id: string, data: UpdateTaskDto): Promise<Task> => {
    await delay(300);
    const tasks = getStoredTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = {
      ...tasks[index],
      ...data,
    };
    saveTasks(tasks);
    return tasks[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    let tasks = getStoredTasks();
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(tasks);
  },
};
