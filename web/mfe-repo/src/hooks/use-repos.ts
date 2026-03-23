import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { repoApi } from '../services/api'
import type { Repository } from '../types'

export function useRepos() {
  return useQuery<Repository[]>({
    queryKey: ['repos'],
    queryFn: repoApi.list,
  })
}

export function useCreateRepo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: repoApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repos'] })
    },
  })
}

export function useDeleteRepo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: repoApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repos'] })
    },
  })
}

export function useRepo(name: string) {
  return useQuery({
    queryKey: ['repo', name],
    queryFn: () => repoApi.get(name),
    enabled: !!name,
  })
}
