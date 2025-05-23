import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export const useJobById = (jobId: string | null) => {
  const url = jobId
    ? `https://jsearch.p.rapidapi.com/job-details?job_id=${jobId}&country=us`
    : null;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    job: data?.data?.[0],
    isLoading,
    isError: !!error,
  };
};
