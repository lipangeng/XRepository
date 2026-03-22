import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskApi } from 'host/services/api'

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.list,
  })
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskApi.get(id),
    enabled: !!id,
  })
}

export function useTriggerTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: taskApi.trigger,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
