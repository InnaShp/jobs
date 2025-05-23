'use client';

import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { User, Briefcase, FileText } from 'lucide-react';

interface UserProfile {
  name: string;
  desiredJobTitle: string;
  aboutMe: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  desiredJobTitle: Yup.string()
    .min(2, 'Job title must be at least 2 characters')
    .max(100, 'Job title must be less than 100 characters')
    .required('Desired job title is required'),
});

const initialValues: UserProfile = {
  name: "",
  desiredJobTitle: "",
  aboutMe: "",
};

const AuthForm = () => {
  const router = useRouter();

  const handleSubmit = (values: UserProfile) => {
    localStorage.setItem('userProfile', JSON.stringify(values));
    router.push('/'); 
  };

  const inputClassName = "mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:outline-none bg-gray-50 text-gray-700 placeholder-gray-400";

  const labelClassName = "block text-md font-bold text-gray-600 mb-1.5 flex items-center";

  const errorClassName = "mt-1 text-sm text-red-400 flex items-center gap-1";

  return (
    <div className="w-full">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
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
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-medium"
            >
              {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AuthForm; 