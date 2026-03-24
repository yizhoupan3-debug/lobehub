import useSWR from 'swr';

export interface AutomationTask {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'UNKNOWN' | string;
  rrule: string;
  prompt: string;
  model: string;
  execution_environment: string;
  created_at: number;
  updated_at: number;
  cwds: string[];
}

export interface AutomationsResponse {
  automations: AutomationTask[];
  error?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useCodexAutomations = () => {
  const { data, error, isLoading, mutate } = useSWR<AutomationsResponse>(
    '/api/codex/automations',
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 60000, 
    }
  );

  return {
    automations: data?.automations || [],
    isLoading,
    isError: !!error,
    mutate,
  };
};
