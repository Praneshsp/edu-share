'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { AlertCircle, Users, ChevronLeft, BookOpen, Calendar, MessageCircle, Award, Clock } from 'lucide-react';

export default function GroupDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  
  const [group, setGroup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchGroup = async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', params.groupId as string)
        .single();
      
      if (error) {
        console.error('Error fetching group:', error);
      } else {
        setGroup(data);
      }
      setIsLoading(false);
    };

    fetchGroup();
  }, [params.groupId]);

  const handleJoinCourse = async () => {
    if (!group) return;
  
    const {data : user} = await supabase.auth.getUser();
  
    const userId = user.user?.id;
  
    // Prevent joining again if already in the students array
    if (group.students.includes(userId)) {
      alert("Already joined this course.");
      return;
    }
  
    const updatedStudents = [...group.students, userId];
  
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
      setShowConfirmation(true);
    }
  };
  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-200"></div>
          <div className="text-slate-400">Loading group details...</div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <div className="text-xl text-red-400">Group not found</div>
          <button
            onClick={() => router.back()}
            className="text-slate-600 hover:text-slate-800 transition-colors"
          >
            Return to groups
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-slate-600 hover:text-slate-800 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
          <span className="ml-2">Back to Groups</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">{group.title}</h1>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full">
                    {group.category || 'General'}
                  </span>
                </div>
                <button
                  onClick={handleJoinCourse}
                  className={`
                    px-6 py-3 rounded-lg transition-all duration-200
                    ${isJoined 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"}
                  `}
                  disabled={isJoined}
                >
                  {isJoined ? "Already Joined" : "Join Group"}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="flex items-center text-slate-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{group.students?.length || 0} Students</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span>Active Forum</span>
                </div>
              </div>

              <div className="border-b border-slate-200 mb-6">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        py-4 px-1 border-b-2 font-medium text-sm transition-colors
                        ${activeTab === tab.id
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}
                      `}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {activeTab === 'overview' && (
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed">
                    {group.overview || `Join this comprehensive learning experience where you'll master key concepts 
                    through hands-on projects and collaborative learning. Our experienced mentors will guide you through 
                    practical exercises and real-world applications.`}
                  </p>
                  
                  
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Group Owner</h3>
                <div className="flex items-center space-x-4 mb-4">

                  <div>
                    <p className="font-medium text-slate-800">{group.mentor}</p>
                    <p className="text-sm text-slate-500">Owner</p>
                  </div>
                </div>

            </div>

            {/*  */}
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {isJoined ? "Successfully joined!" : "Login Required"}
            </h3>
            <p className="text-slate-600 mb-4">
              {isJoined 
                ? "You're now a member of this group. Start collaborating with your peers!"
                : "Please log in to join this group and access all features."}
            </p>
            <button
              onClick={() => setShowConfirmation(false)}
              className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {isJoined ? "Got it" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}