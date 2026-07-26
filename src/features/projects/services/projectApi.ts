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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

// Dynamically fetch task counts from localStorage to keep ProjectCard counts synced
const getTasksCountForProject = (projectId: string) => {
  const tasksData = localStorage.getItem('taskflow_tasks');
  if (!tasksData) return { total: 0, completed: 0 };
  const allTasks = JSON.parse(tasksData) as any[];
  const projectTasks = allTasks.filter(t => t.projectId === projectId);
  const completed = projectTasks.filter(t => t.status === 'Done').length;
  return { total: projectTasks.length, completed };
};

export const projectApi = {
  getAll: async (): Promise<Project[]> => {
    await delay(300);
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
    await delay(200);
    const projects = getStoredProjects();
    const project = projects.find(p => p.id === id);
    if (!project) throw new Error('Project not found');
    const counts = getTasksCountForProject(project.id);
    return {
      ...project,
      tasksCount: counts.total,
      completedTasksCount: counts.completed
    };
  },

  create: async (data: CreateProjectDto): Promise<Project> => {
    await delay(400);
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
    await delay(300);
    const projects = getStoredProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    
    projects[index] = {
      ...projects[index],
      ...data,
    };
    saveProjects(projects);
    return projects[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    let projects = getStoredProjects();
    projects = projects.filter(p => p.id !== id);
    saveProjects(projects);
    
    // Cleanup related tasks
    const tasksData = localStorage.getItem('taskflow_tasks');
    if (tasksData) {
      const tasks = JSON.parse(tasksData) as any[];
      const filteredTasks = tasks.filter(t => t.projectId !== id);
      localStorage.setItem('taskflow_tasks', JSON.stringify(filteredTasks));
    }
  },
};
