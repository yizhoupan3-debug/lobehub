import useSWR from 'swr';

export interface AutomationTask {
  created_at: number;
  cwds: string[];
  execution_environment: string;
  id: string;
  model: string;
  name: string;
  prompt: string;
  rrule: string;
  status: 'ACTIVE' | 'PAUSED' | 'UNKNOWN' | string;
  updated_at: number;
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
