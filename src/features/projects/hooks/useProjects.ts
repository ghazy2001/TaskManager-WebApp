import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../services/projectApi';
import type { CreateProjectDto, UpdateProjectDto } from '../types/project.types';

export const useProjects = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (newProject: CreateProjectDto) => projectApi.create(newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) =>
      projectApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    projects: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createProject: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProject: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProject: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
