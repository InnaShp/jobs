"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

export const CustomAlert = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500 text-gray-800 px-6 py-4 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center gap-3 animate-fade-in z-50 min-w-[300px] backdrop-blur-sm">
      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      <div className="flex-grow">
        <p className="font-medium text-gray-800">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-white/50 rounded-full transition-colors"
      >
        <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
};
