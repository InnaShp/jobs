import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Job } from '@/components/JobSearch';

interface UseJobsOptions {
  query: string;
  page?: number;
  numPages?: number;
  country?: string;
  datePosted?: string;
}

const useJobs = ({
  query,
  page = 1,
  numPages = 1,
  country = 'us',
  datePosted = 'all',
}: UseJobsOptions) => {
  const shouldFetch = query !== '';

  const encodedQuery = encodeURIComponent(query);

  const endpoint = shouldFetch
    ? `/search?query=${encodedQuery}&page=${page}&num_pages=${numPages}&country=${country}&date_posted=${datePosted}`
    : null;

  const { data, error, isLoading } = useSWR(endpoint, fetcher);

  return {
    jobs: data?.data ?? [] as Job[],
    totalJobs: data?.total_jobs ?? 0,
    isLoading,
    isError: !!error,
  };
};

export default useJobs;
