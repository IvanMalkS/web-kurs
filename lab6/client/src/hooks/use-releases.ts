import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

type CreateReleaseInput = z.infer<typeof api.releases.create.input>;

export function useReleases() {
  return useQuery({
    queryKey: [api.releases.list.path],
    queryFn: async () => {
      const res = await fetch(api.releases.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch releases");
      const raw = await res.json();
      return raw.map((r: any) => ({
        ...r,
        releaseDate: new Date(r.releaseDate),
      }));
    },
  });
}

export function useCreateRelease() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateReleaseInput) => {
      const res = await fetch(api.releases.create.path, {
        method: api.releases.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create release");
      return api.releases.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.releases.list.path] }),
  });
}

export function useDeleteRelease() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.releases.delete.path, { id });
      const res = await fetch(url, { method: api.releases.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete release");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.releases.list.path] }),
  });
}
