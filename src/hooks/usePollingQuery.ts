import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function usePollingQuery<T>(
  key: string,
  url: string,
  intervalMs: number,
  headers: Record<string, string> = {}
) {
  return useQuery<T>({
    queryKey: [key, url],
    queryFn: async () => {
      const res = await axios.get<T>(url, { headers });
      return res.data;
    },
    refetchInterval: intervalMs,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
    staleTime: 0,
    retry: 3
  });
}
