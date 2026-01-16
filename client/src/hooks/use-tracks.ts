import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

export function useTracks() {
  return useQuery({
    queryKey: [api.tracks.getAll.path],
    queryFn: async () => {
      const res = await fetch(api.tracks.getAll.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tracks");
      return api.tracks.getAll.responses[200].parse(await res.json());
    },
  });
}

export function useCurrentTrack() {
  return useQuery({
    queryKey: [api.tracks.getCurrent.path],
    queryFn: async () => {
      const res = await fetch(api.tracks.getCurrent.path, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch current track");
      return await res.json(); // Schema is complex for this one, trusting backend
    },
  });
}

export function useTodayProgress() {
  return useQuery({
    queryKey: [api.progress.getToday.path],
    queryFn: async () => {
      const res = await fetch(api.progress.getToday.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch progress");
      return await res.json();
    },
  });
}

export function useToggleProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, date }: { taskId: number; date: string }) => {
      const res = await fetch(api.progress.toggle.path, {
        method: api.progress.toggle.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, date }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to toggle progress");
      return api.progress.toggle.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.progress.getToday.path] });
    },
  });
}

export function useSubmitAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { answers: any; recommendedLevel: number }) => {
      const res = await fetch(api.assessment.submit.path, {
        method: api.assessment.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to submit assessment");
      return api.assessment.submit.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
      queryClient.invalidateQueries({ queryKey: [api.tracks.getCurrent.path] });
    },
  });
}
