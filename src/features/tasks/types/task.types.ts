export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Todo' | 'InProgress' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  projectId: string;
  createdAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  projectId: string;
}

export interface UpdateTaskDto {
  id?: string;
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
}
