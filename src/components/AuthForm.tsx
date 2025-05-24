"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { Briefcase, FileText, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { CustomAlert } from "./Alert";

export interface UserProfile {
  name: string;
  desiredJobTitle: string;
  aboutMe: string;
}

interface AuthFormProps {
  mode: "create" | "edit";
  handleClose?: () => void;
}

const alertStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
  desiredJobTitle: Yup.string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must be less than 100 characters")
    .required("Desired job title is required"),
});

const initialValues: UserProfile = {
  name: "",
  desiredJobTitle: "",
  aboutMe: "",
};

// Move className constants outside component
const inputClassName =
  "mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:outline-none bg-gray-50 text-gray-700 placeholder-gray-400";
const labelClassName =
  "block text-md font-bold text-slate-700 mb-1.5 flex items-center";
const errorClassName = "mt-1 text-sm text-red-400 flex items-center gap-1";

const AuthForm = ({ mode = "create", handleClose }: AuthFormProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();
  const isEditing = mode === "edit";

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  const handleEdit = (values: UserProfile) => {
    // Check if there are any changes
    const hasChanges = Object.keys(values).some(
      (key) =>
        values[key as keyof UserProfile] !== profile?.[key as keyof UserProfile]
    );

    if (!hasChanges) {
      handleClose?.();
      return;
    }

    localStorage.setItem("userProfile", JSON.stringify(values));
    setProfile(values);
    setAlertMessage("Profile successfully updated!");
    setShowAlert(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem("userProfile");
    setProfile(null);
    handleClose?.();
    window.location.href = "/";
  };

  const handleSubmit = useCallback(
    (values: UserProfile) => {
      localStorage.setItem("userProfile", JSON.stringify(values));
      router.push("/");
    },
    [router]
  );

  return (
    <div className="w-full">
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
      <Formik
        initialValues={isEditing && profile ? profile : initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          isEditing ? handleEdit(values) : handleSubmit(values);
        }}
        enableReinitialize
      >
        {() => (
          <Form className="space-y-7">
            <div>
              <label htmlFor="name" className={labelClassName}>
                <User className="inline-block w-5 h-5 mr-1.5" />
                Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                className={inputClassName}
              />
              <ErrorMessage
                name="name"
                component="div"
                className={errorClassName}
              />
            </div>
            <div>
              <label htmlFor="desiredJobTitle" className={labelClassName}>
                <Briefcase className="inline-block w-5 h-5 mr-1.5" />
                Desired Job Title
              </label>
              <Field
                type="text"
                id="desiredJobTitle"
                name="desiredJobTitle"
                placeholder="e.g. Senior Frontend Developer"
                className={inputClassName}
              />
              <ErrorMessage
                name="desiredJobTitle"
                component="div"
                className={errorClassName}
              />
            </div>
            <div>
              <label htmlFor="aboutMe" className={labelClassName}>
                <FileText className="inline-block w-5 h-5 mr-1.5" />
                About Me
              </label>
              <Field
                as="textarea"
                id="aboutMe"
                name="aboutMe"
                rows={4}
                placeholder="Tell us about your experience, skills, and career goals..."
                className={inputClassName}
              />
              <ErrorMessage
                name="aboutMe"
                component="div"
                className={errorClassName}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-medium"
            >
              {isEditing ? "Edit Profile" : "Create Profile"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full bg-red-600 text-white px-8 py-3 rounded-lg font-medium mt-4"
              >
                Sign Out
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AuthForm;
