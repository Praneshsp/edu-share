"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';


export default function GroupDetailsPage() {
  const router = useRouter();
  const params = useParams();
  console.log("Params:", params);
console.log("Group ID:", params?.groupId);

  const supabase = createClient()
  const [group, setGroup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', params.groupId as string)
        .single();
      console.log(data)
      if (error) {
        console.error('Error fetching group:', error);
      } else {
        setGroup(data);
      }

      setIsLoading(false);
    };

    fetchGroup();
  }, [ params.groupId]);

  const handleJoinCourse = async () => {
    if (!group) return;

    const user = await supabase.auth.getUser();
    if (!user.data?.user) {
      alert('You need to log in to join this group.');
      return;
    }

    const updatedStudents = [...group.students, user.data.user.id];

    const { error } = await supabase
      .from('groups')
      .update({ students: updatedStudents })
      .eq('id', params.groupId);

    if (error) {
      console.error('Error joining group:', error);
    } else {
      setIsJoined(true);
      setGroup((prev: any) => ({
        ...prev,
        students: updatedStudents
      }));
    }
  };

  if (isLoading) return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  if (!group) return <div className="text-center text-red-500 text-xl mt-10">Group not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{group.title}</h1>
      <p className="text-lg text-gray-600 mb-2">Mentor: <span className="font-semibold">{group.mentor_names.join(', ')}</span></p>
      <p className="text-lg text-gray-600 mb-4">Students Enrolled: <span className="font-semibold">{group.students.length}</span></p>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleJoinCourse}
          className={`px-6 py-2 rounded-lg transition-all text-white ${
            isJoined ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isJoined}
        >
          {isJoined ? "Joined" : "Join Group"}
        </button>

        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-all"
        >
          Back to Groups
        </button>
      </div>
    </div>
  );
}
