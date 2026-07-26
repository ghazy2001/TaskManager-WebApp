import { useQuery } from '@tanstack/react-query';
import { projectApi } from '../services/projectApi';
import { taskApi } from '../../tasks/services/taskApi';

export const useProjectDetails = (projectId: string) => {
  const projectQuery = useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => projectApi.getById(projectId),
    enabled: !!projectId,
  });

  const tasksQuery = useQuery({
    queryKey: ['tasks', { projectId }],
    queryFn: () => taskApi.getByProjectId(projectId),
    enabled: !!projectId,
  });

  return {
    project: projectQuery.data,
    projectLoading: projectQuery.isLoading,
    projectError: projectQuery.isError,
    
    tasks: tasksQuery.data || [],
    tasksLoading: tasksQuery.isLoading,
    tasksError: tasksQuery.isError,
  };
};
