import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Gadget } from "@shared/schema";
import { z } from "zod";

type CreateGadgetInput = z.infer<typeof api.gadgets.create.input>;
type UpdateGadgetInput = z.infer<typeof api.gadgets.update.input>;

export function useGadgets(filters?: { category?: string; featured?: boolean }) {
  const queryKey = [api.gadgets.list.path, filters?.category, filters?.featured].filter(Boolean);
  return useQuery({
    queryKey,
    queryFn: async () => {
      let url = api.gadgets.list.path;
      const params = new URLSearchParams();
      if (filters?.category) params.append("category", filters.category);
      if (filters?.featured !== undefined) params.append("featured", String(filters.featured));
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch gadgets");
      return api.gadgets.list.responses[200].parse(await res.json());
    },
  });
}

export function useGadget(id: number) {
  return useQuery({
    queryKey: [api.gadgets.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.gadgets.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch gadget");
      return api.gadgets.get.responses[200].parse(await res.json());
    },
    enabled: !isNaN(id),
  });
}

export function useCreateGadget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateGadgetInput) => {
      const res = await fetch(api.gadgets.create.path, {
        method: api.gadgets.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create gadget");
      return api.gadgets.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.gadgets.list.path] }),
  });
}

export function useUpdateGadget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & UpdateGadgetInput) => {
      const url = buildUrl(api.gadgets.update.path, { id });
      const res = await fetch(url, {
        method: api.gadgets.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update gadget");
      return api.gadgets.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.gadgets.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.gadgets.get.path] });
    },
  });
}

export function useDeleteGadget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.gadgets.delete.path, { id });
      const res = await fetch(url, { method: api.gadgets.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete gadget");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.gadgets.list.path] }),
  });
}
