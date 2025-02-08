'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

type Course = {
  id: number;
  title: string;
  mentor: string;
  students: number;
};

const courses: Course[] = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    mentor: "Dr. Smith",
    students: 24,
  },
  {
    id: 2,
    title: "Advanced Mathematics",
    mentor: "Prof. Johnson",
    students: 18,
  },
  {
    id: 3,
    title: "Physics 101",
    mentor: "Dr. Brown",
    students: 30,
  }
];

export default function GroupDetailsPage() {
  const router = useRouter();
  const params = useParams()
  console.log(params)
  const course = courses.find((course) => course.id === Number(1));

  if (!course) {
    return <div className="text-center text-red-500">Course not found</div>;
  }

  return (
    <div className="text-text-primary max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-[rgb(62,62,62)]">{course.title}</h1>
      <p className="text-lg text-[rgb(62,62,62)]">Mentor: {course.mentor}</p>
      <p className="text-lg text-[rgb(62,62,62)]">Students Enrolled: {course.students}</p>
      <button
        onClick={() => router.back()}
        className="mt-6 px-4 py-2 bg-[rgb(211,163,77)] hover:bg-[rgb(191,143,57)] text-[rgb(62,62,62)] rounded-lg transition-colors"
      >
        Back to Courses
      </button>
    </div>
  );
}
