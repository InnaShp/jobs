"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import useJobs from "@/hooks/useJobs";
import { UserProfile } from "./AuthForm";

export interface Job {
  job_id: string;
  employer_name: string;
  employer_logo: string | null;
  job_title: string;
  job_description: string;
  job_city: string;
  job_country: string;
  job_apply_link: string;
  job_employment_type: string;
  job_salary?: number;
  job_salary_currency?: string;
  job_posted_at_datetime_utc?: string;
}

interface JobSearchProps {
  searchQuery: string;
}

const JobSearch = ({ searchQuery }: JobSearchProps) => {
  const [likedJobs, setLikedJobs] = useState<Job[]>([]);
  const [page, setPage] = useState<number>(1);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Load user profile
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
  }, []);

  // Load liked jobs
  useEffect(() => {
    const likedJobsData = JSON.parse(localStorage.getItem("likedJobs") || "[]");
    setLikedJobs(likedJobsData);
  }, []);

  // Handle scroll on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Debounce search query
  useEffect(() => {
    const query = searchQuery || userProfile?.desiredJobTitle || "developer";
    const timer = setTimeout(() => {
      if (query.trim()) {
        setDebouncedQuery(query);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, userProfile?.desiredJobTitle]);

  // Get jobs using the debounced query
  const { jobs = [], isLoading, isError, error } = useJobs({
    query: debouncedQuery,
    page,
  });

  const toggleLike = (job: Job, e: React.MouseEvent) => {
    e.preventDefault();
    const newLikedJobs = likedJobs.some((likedJob) => likedJob.job_id === job.job_id)
      ? likedJobs.filter((likedJob) => likedJob.job_id !== job.job_id)
      : [...likedJobs, job];

    setLikedJobs(newLikedJobs);
    localStorage.setItem("likedJobs", JSON.stringify(newLikedJobs));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading jobs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        {error?.includes("Too many requests") && (
          <p className="text-gray-600">
            Please wait a moment before trying again.
          </p>
        )}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center text-gray-500 py-8">
          No jobs found matching &ldquo;{debouncedQuery || searchQuery || userProfile?.desiredJobTitle || "developer"}&rdquo;
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Found {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
          {searchQuery
            ? ` matching &ldquo;${searchQuery}&rdquo;`
            : userProfile
            ? ` matching your profile preferences`
            : " matching default search"}
        </div>
        {jobs.map((job: Job) => (
          <Link
            href={`/jobs/${job.job_id}`}
            key={job.job_id}
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <Image
                  src={
                    job.employer_logo ||
                    "https://icons.veryicon.com/png/o/business/oa-attendance-icon/company-27.png"
                  }
                  alt={`${job.employer_name} logo`}
                  width={48}
                  height={48}
                  className="rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {job.job_title}
                  </h3>
                  <p className="text-gray-600">{job.employer_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                  {job.job_employment_type}
                </span>
                <button
                  onClick={(e) => toggleLike(job, e)}
                  className={`text-gray-400 hover:text-red-500 transition-colors ${
                    likedJobs.some((likedJob) => likedJob.job_id === job.job_id)
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  <Heart
                    className={`h-6 w-6 ${
                      likedJobs.some((likedJob) => likedJob.job_id === job.job_id)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                </button>
              </div>
            </div>
            <p className="mt-2 text-gray-500">
              {job.job_city}, {job.job_country}
            </p>
            <p className="mt-4 text-gray-700 line-clamp-2">
              {job.job_description}
            </p>
            <div className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
              View Details →
            </div>
          </Link>
        ))}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-gray-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="px-4 py-2 text-gray-700 font-medium">
            Page {page}
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-200 rounded text-gray-800"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
