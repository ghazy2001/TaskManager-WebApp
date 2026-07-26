import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../services/taskApi';
import type { CreateTaskDto, UpdateTaskDto } from '../types/task.types';

export const useTaskMutations = (projectId: string) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newTask: CreateTaskDto) => taskApi.create(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', { projectId }] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
      taskApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', { projectId }] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', { projectId }] });
    },
  });

  return {
    createTask: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTask: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTask: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
