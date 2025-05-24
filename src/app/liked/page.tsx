'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Heart } from 'lucide-react';
import { Job } from '@/components/JobSearch';

export default function LikedJobs() {
  const [likedJobs, setLikedJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Load liked jobs from localStorage
    const loadLikedJobs = () => {
      const likedJobsData = JSON.parse(localStorage.getItem('likedJobs') || '[]');
      setLikedJobs(likedJobsData);
    };

    loadLikedJobs();
    // Listen for storage changes
    window.addEventListener('storage', loadLikedJobs);
    return () => window.removeEventListener('storage', loadLikedJobs);
  }, []);

  const removeFromLiked = (jobId: string) => {
    const updatedLikedJobs = likedJobs.filter(job => job.job_id !== jobId);
    localStorage.setItem('likedJobs', JSON.stringify(updatedLikedJobs));
    setLikedJobs(updatedLikedJobs);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link 
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to jobs
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Liked Jobs</h1>

      {likedJobs.length > 0 ? (
        <div className="space-y-4">
          {likedJobs.map((job) => (
            <div key={job.job_id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <Image
                    src={job.employer_logo || "https://icons.veryicon.com/png/o/business/oa-attendance-icon/company-27.png"}
                    alt={`${job.employer_name} logo`}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{job.job_title}</h3>
                    <p className="text-gray-600">{job.employer_name}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromLiked(job.job_id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Heart className="h-6 w-6 fill-current" />
                </button>
              </div>
              <p className="mt-2 text-gray-500">{job.job_city}, {job.job_country}</p>
              {job.job_salary && (
                <p className="mt-2 text-gray-500">
                  {job.job_salary} {job.job_salary_currency}
                </p>
              )}
              <p className="mt-4 text-gray-700 line-clamp-2">{job.job_description}</p>
              <Link 
                href={`/jobs/${job.job_id}`}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium inline-block"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p className="mb-4">You haven&apos;t liked any jobs yet.</p>
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Browse jobs
          </Link>
        </div>
      )}
    </div>
  );
} 