"use client";

import Header from "@/components/Header";
import JobSearch from "@/components/JobSearch";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    setIsAuthenticated(!!storedProfile);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-gray-800 mb-4 text-4xl font-bold">
              Welcome to JobSearch!
            </h1>
            {!isAuthenticated && (
              <>
                <p className="text-gray-600 mb-4">
                  Create a profile to save your job preferences and get
                  personalized recommendations
                </p>
                <Link
                  href={`/create-profile`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Create Profile →
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
      {/* <JobSearch searchQuery={searchQuery} /> */}
    </div>
  );
}
