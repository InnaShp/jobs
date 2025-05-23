"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useJobById } from "@/hooks/useJobById";

export default function JobDetails() {
  const { id } = useParams();

  const { job, isLoading, isError } = useJobById(id as string);

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Load liked status from localStorage
    const likedJobIds = JSON.parse(localStorage.getItem("likedJobs") || "[]");
    setIsLiked(likedJobIds.includes(id));
  }, [id]);

  const toggleLike = () => {
    const likedJobIds = JSON.parse(localStorage.getItem("likedJobs") || "[]");
    const newLikedJobs = isLiked
      ? likedJobIds.filter((likedJobId: string) => likedJobId !== id)
      : [...likedJobIds, id];

    setIsLiked(!isLiked);
    localStorage.setItem("likedJobs", JSON.stringify(newLikedJobs));
  };

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Job not found
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to job listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to jobs
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <img
              src={job.employer_logo}
              alt={`${job.employer_name} logo`}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {job.job_title}
              </h2>
              <p className="text-xl text-gray-600">{job.employer_name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
              {job.job_employment_type}
            </span>
            <button
              onClick={toggleLike}
              className={`text-gray-400 hover:text-red-500 transition-colors ${
                isLiked ? "text-red-500" : ""
              }`}
            >
              <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Location</h2>
            <p className="text-gray-900">
              {job.job_city}, {job.job_country}
            </p>
          </div>
          {job.job_salary && (
            <div>
              <h2 className="text-sm font-medium text-gray-500">Salary</h2>
              <p className="text-gray-900">
                {job.job_salary} {job.job_salary_currency}
              </p>
            </div>
          )}
          <div>
            <h2 className="text-sm font-medium text-gray-500">Posted Date</h2>
            <p className="text-gray-900">
              {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Description
          </h2>
          <p className="text-gray-700 whitespace-pre-line">
            {job.job_description}
          </p>
        </div>

        <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Apply Now
        </button>
      </div>
    </div>
  );
}
