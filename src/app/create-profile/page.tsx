"use client";

import AuthForm from "@/components/AuthForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateProfile() {
  return (
    <div className="min-h-screen bg-gray-50 max-w-4xl mx-auto p-8">
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to jobs
      </Link>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join JobSearch
          </h1>
          <p className="text-lg text-gray-600">
            Create your profile to start your job search journey
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-[600px] mx-auto px-4 py-5 sm:p-8">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
