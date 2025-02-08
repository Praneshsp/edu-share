'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

type Course = {
  id: number;
  title: string;
  mentor: string;
  students: number;
  description: string;
};

const courses: Course[] = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    mentor: "Dr. Smith",
    students: 24,
    description: "Learn the fundamentals of computing, including programming, data structures, and algorithms."
  },
  {
    id: 2,
    title: "Advanced Mathematics",
    mentor: "Prof. Johnson",
    students: 18,
    description: "Deep dive into calculus, linear algebra, and probability, preparing for real-world applications."
  },
  {
    id: 3,
    title: "Physics 101",
    mentor: "Dr. Brown",
    students: 30,
    description: "Explore classical mechanics, thermodynamics, and wave physics through interactive learning."
  }
];

export default function GroupDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const course = courses.find((course) => course.id === Number(params.groupId));

  const [isJoined, setIsJoined] = useState(false);

  if (!course) {
    return <div className="text-center text-red-500 text-xl mt-10">Course not found</div>;
  }

  const handleJoinCourse = () => {
    setIsJoined(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{course.title}</h1>
      <p className="text-lg text-gray-600 mb-2">Mentor: <span className="font-semibold">{course.mentor}</span></p>
      <p className="text-lg text-gray-600 mb-4">Students Enrolled: <span className="font-semibold">{course.students}</span></p>
      <p className="text-gray-700 text-base leading-relaxed">{course.description}</p>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleJoinCourse}
          className={`px-6 py-2 rounded-lg transition-all text-white ${
            isJoined ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isJoined}
        >
          {isJoined ? "Joined" : "Join Course"}
        </button>

        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-all"
        >
          Back to Courses
        </button>
      </div>
    </div>
  );
}
