import { UserProfile } from "@/components/AuthForm";
import { Job } from "@/components/JobSearch";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

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
  country = "us",
  datePosted = "all",
  userProfile = null,
}: UseJobsOptions) => {
  // Don't make the request if query is empty
  const shouldFetch = query.trim() !== "";
  const encodedQuery = encodeURIComponent(query);
  const endpoint = `/search?query=${encodedQuery}&page=${page}&num_pages=${numPages}&country=${country}&date_posted=${datePosted}`;

  const { data, error, isLoading } = useSWR(
    shouldFetch ? endpoint : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
      errorRetryCount: 1,
      errorRetryInterval: 5000,
      onError: (err) => {
        if (err.response?.status === 429) {
          console.warn("Rate limit exceeded. Please try again later.");
        }
      },
    }
  );

  return {
    jobs: data?.data ?? ([] as Job[]),
    totalJobs: data?.total_jobs ?? 0,
    isLoading,
    isError: !!error,
    error:
      error?.response?.status === 429
        ? "Too many requests. Please try again later."
        : error?.message || "An error occurred while fetching jobs.",
  };
};

export default useJobs;
