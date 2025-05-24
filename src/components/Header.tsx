"use client";

import { Menu, Search, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserProfile } from "./AuthForm";
import ProfileModal from "./ProfileModal";

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
    setIsMenuOpen(false);
  };

  const handleRedirect = () => {
    router.push("/create-profile");
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                JobSearch
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jobs by title..."
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/liked"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Favorites
              </Link>
              <button
                onClick={profile ? toggleProfileModal : handleRedirect}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <User className="h-5 w-5" />
                <span>{profile ? profile.name : "Account"}</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link
                  href="/liked"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                >
                  Favorites
                </Link>
                <button
                  onClick={profile ? toggleProfileModal : handleRedirect}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 w-full"
                >
                  <User className="h-5 w-5" />
                  <span>{profile ? profile.name : "Account"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default Header;
