import axiosInstance from '../../../config/axiosInstance';
import type { Project, CreateProjectDto, UpdateProjectDto } from '../types/project.types';

const STORAGE_KEY = 'taskflow_projects';

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Neo-Tech Branding Identity',
    description: 'Complete visual identity design including logo, typography, and color palette to establish modern brand presence.',
    status: 'Active',
    startDate: '2026-10-18',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'proj-2',
    name: 'Smart Delivery App',
    description: 'UI/UX development and global maps integration for the new logistics platform, targeting high user engagement.',
    status: 'Active',
    startDate: '2026-10-23',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'proj-3',
    name: 'SEO Optimization Campaign',
    description: 'Comprehensive optimization for the e-commerce site to boost organic search rankings and conversion rates.',
    status: 'Active',
    startDate: '2026-11-08',
    createdAt: new Date().toISOString(),
  }
];

const getStoredProjects = (): Project[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  }
  return JSON.parse(data);
};

const saveProjects = (projects: Project[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

const getTasksCountForProject = (projectId: string) => {
  const tasksData = localStorage.getItem('taskflow_tasks');
  if (!tasksData) return { total: 0, completed: 0 };
  const allTasks = JSON.parse(tasksData) as any[];
  const projectTasks = allTasks.filter(t => t.projectId === String(projectId));
  const completed = projectTasks.filter(t => t.status === 'Done' || t.status === 2).length;
  return { total: projectTasks.length, completed };
};

const normalizeProject = (p: any): Project => {
  const item = p?.value || p;
  const id = String(item.id || item.projectId || item.Id || `proj-${Date.now()}`);
  const counts = getTasksCountForProject(id);
  return {
    id,
    name: item.name || item.Name || item.title || item.Title || 'Untitled Project',
    description: item.description || item.Description || '',
    status: item.status || item.Status || 'Active',
    startDate: item.startDate || item.StartDate || item.createdAt || item.CreatedAt,
    endDate: item.endDate || item.EndDate,
    tasksCount: item.tasksCount ?? item.TasksCount ?? counts.total,
    completedTasksCount: item.completedTasksCount ?? item.CompletedTasksCount ?? counts.completed,
    createdAt: item.createdAt || item.CreatedAt || new Date().toISOString(),
  };
};

export const projectApi = {
  getAll: async (): Promise<Project[]> => {
    try {
      const response = await axiosInstance.get('/Projects');
      const list = Array.isArray(response.data)
        ? response.data
        : (response.data && Array.isArray(response.data.value) ? response.data.value : null);
      if (list) {
        return list.map(normalizeProject);
      }
    } catch (error) {
      console.warn('Backend /Projects API endpoint not reachable yet, using fallback client:', error);
    }
    const projects = getStoredProjects();
    return projects.map(p => {
      const counts = getTasksCountForProject(p.id);
      return {
        ...p,
        tasksCount: counts.total,
        completedTasksCount: counts.completed
      };
    });
  },

  getById: async (id: string): Promise<Project> => {
    try {
      const response = await axiosInstance.get(`/Projects/${id}`);
      if (response.data) {
        const item = response.data.value || response.data;
        return normalizeProject(item);
      }
    } catch (error) {
      console.warn(`Backend /Projects/${id} API endpoint not reachable yet, using fallback client:`, error);
    }
    const projects = getStoredProjects();
    const project = projects.find(p => String(p.id) === String(id));
    if (!project) throw new Error('Project not found');
    const counts = getTasksCountForProject(project.id);
    return {
      ...project,
      tasksCount: counts.total,
      completedTasksCount: counts.completed
    };
  },

  create: async (data: CreateProjectDto): Promise<Project> => {
    try {
      const response = await axiosInstance.post('/Projects/Create', {
        name: data.name,
        description: data.description,
      });
      if (response.data) {
        const item = response.data.value || response.data;
        return normalizeProject(item);
      }
    } catch (error) {
      console.warn('Backend POST /Projects API endpoint error, saving locally:', error);
    }
    const projects = getStoredProjects();
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: data.name,
      description: data.description,
      status: data.status || 'Active',
      startDate: data.startDate,
      createdAt: new Date().toISOString(),
    };
    projects.push(newProject);
    saveProjects(projects);
    return newProject;
  },

  update: async (id: string, data: UpdateProjectDto): Promise<Project> => {
    try {
      const response = await axiosInstance.put(`/Projects/Update/${id}`, {
        name: data.name,
        description: data.description,
      });
      if (response.data) {
        const item = response.data.value || response.data;
        return normalizeProject(item);
      }
    } catch (error) {
      console.warn(`Backend PUT /Projects/${id} API endpoint error, updating locally:`, error);
    }
    const projects = getStoredProjects();
    const index = projects.findIndex(p => String(p.id) === String(id));
    if (index === -1) throw new Error('Project not found');
    
    projects[index] = {
      ...projects[index],
      ...data,
    };
    saveProjects(projects);
    return projects[index];
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/Projects/${id}`);
    } catch (error) {
      console.warn(`Backend DELETE /Projects/${id} API endpoint not reachable yet, deleting locally:`, error);
    }
    let projects = getStoredProjects();
    projects = projects.filter(p => String(p.id) !== String(id));
    saveProjects(projects);
    
    const tasksData = localStorage.getItem('taskflow_tasks');
    if (tasksData) {
      const tasks = JSON.parse(tasksData) as any[];
      const filteredTasks = tasks.filter(t => String(t.projectId) !== String(id));
      localStorage.setItem('taskflow_tasks', JSON.stringify(filteredTasks));
    }
  },
};
