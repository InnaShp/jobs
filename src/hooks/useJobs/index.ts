import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Job } from '@/components/JobSearch';
import { useCallback, useState, useEffect } from 'react';
import { UserProfile } from '@/components/AuthForm';

export interface UseJobsOptions {
  query: string;
  page?: number;
  numPages?: number;
  country?: string;
  datePosted?: string;
  userProfile?: UserProfile | null;
}

const useJobs = ({
  query,
  page = 1,
  numPages = 1,
  country = 'us',
  datePosted = 'all',
  userProfile = null,
}: UseJobsOptions) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [query]);

  const shouldFetch = debouncedQuery !== '';

  // If user has a profile and no search query, use their desired job title
  const searchQuery = shouldFetch ? debouncedQuery : userProfile?.desiredJobTitle || 'developer jobs';
  const encodedQuery = encodeURIComponent(searchQuery);

  const endpoint = `/search?query=${encodedQuery}&page=${page}&num_pages=${numPages}&country=${country}&date_posted=${datePosted}`;

  const { data, error, isLoading } = useSWR(endpoint, fetcher, {
    revalidateOnFocus: false, // Disable revalidation on window focus
    revalidateOnReconnect: false, // Disable revalidation on reconnect
    dedupingInterval: 60000, // Dedupe requests within 1 minute
    errorRetryCount: 3, // Retry failed requests 3 times
    errorRetryInterval: 5000, // Wait 5 seconds between retries
    onError: (err) => {
      if (err.response?.status === 429) {
        console.warn('Rate limit exceeded. Please try again later.');
      }
    },
  });

  return {
    jobs: data?.data ?? [] as Job[],
    totalJobs: data?.total_jobs ?? 0,
    isLoading,
    isError: !!error,
    error: error?.response?.status === 429 
      ? 'Too many requests. Please try again later.' 
      : error?.message || 'An error occurred while fetching jobs.',
  };
};

export default useJobs;
