"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; 

export default function GroupsPage() {
  const supabase = createClient()

  const router = useRouter();
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: "", mentor: "", students: "" });

  useEffect(() => {
    const fetchGroups = async () => {
      const { data, error } = await supabase.from("groups").select("*");
      
      if (error) {
        console.error("Error fetching groups:", error);
      } else {
        setGroups(data);
      }

      setIsLoading(false);
    };

    fetchGroups();
  }, []);

  if (isLoading) return <div className="text-center text-gray-500 mt-10">Loading...</div>;


  const handleCreateCourse = (e : any) => {
    // e.preventDefault();
    // setCourses([...courses, { id: courses.length + 1, ...newCourse }]);
    // setShowModal(false);
  };

  return (
    <div className="text-text-primary px-6 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Groups</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[rgb(211,163,77)] hover:bg-[rgb(191,143,57)] text-[rgb(62,62,62)] rounded-lg"
        >
          + Create New Course
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <input 
                type="text" 
                placeholder="Course Title" 
                className="w-full p-2 border rounded-lg" 
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} 
                required
              />
              <input 
                type="text" 
                placeholder="Mentor" 
                className="w-full p-2 border rounded-lg" 
                onChange={(e) => setNewCourse({ ...newCourse, mentor: e.target.value })} 
                required
              />
              <input 
                type="number" 
                placeholder="Number of Students" 
                className="w-full p-2 border rounded-lg" 
                onChange={(e) => setNewCourse({ ...newCourse, students: e.target.value })} 
                required
              />
              <div className="flex justify-end gap-4">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[rgb(211,163,77)] rounded-lg">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 max-w-3xl">
        {groups.map((course : any) => (
          <div 
            key={course.id} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow w-full"
          >
            <h3 className="text-xl font-semibold text-[rgb(62,62,62)] mb-4">
              {course.title}
            </h3>
            <div className="space-y-2 text-[rgb(62,62,62)]">
              <p className="text-sm">Mentor: {course.mentor}</p>
              <p className="text-sm">{course.students} Students</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button 
                className="px-4 py-2 border border-[rgb(211,163,77)] text-[rgb(211,163,77)] rounded-lg hover:bg-[rgb(211,163,77)] hover:text-white transition-colors"

                onClick={() => router.push(`/dashboard/groups/${course.id as string}`)}
              >
                View Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
