export type ProjectStatus = 'Active' | 'Completed' | 'OnHold';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  tasksCount?: number;
  completedTasksCount?: number;
  createdAt: string;
}

export interface CreateProjectDto {
  name: string;
  description: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectDto {
  id?: string;
  name?: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
}
