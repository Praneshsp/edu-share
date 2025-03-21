'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Plus, Users, BookOpen, Search, X, Crown } from "lucide-react";

interface Group {
  id: string;
  title: string;
  overview: string;
  mentor: string;
  students: string[];
}

interface Profile {
  name: string;
}

interface User {
  id: string;
  email?: string;
}

export default function GroupsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    mentor: "",
    overview: "",
  });

  console.log(user)


  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, [supabase.auth]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();
      if (data) {
        setProfile(data);
      }
    };
    fetchProfile();
  }, [user, supabase]);

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
  }, [supabase]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    const { data, error } = await supabase
      .from('groups') 
      .insert([{ 
        title: newCourse.title,
        overview: newCourse.overview,
        mentor: profile?.name || 'Unknown',
        students: [user.id.toString()],
      }])  
      .select();
  
    if (error) {
      console.error("Error creating course:", error);
    } else if (data && data[0]) {
      const newGroup: Group = {
        id: data[0].id,
        title: data[0].title,
        overview: data[0].overview,
        mentor: data[0].mentor,
        students: data[0].students || [],
      };
      setGroups(prevGroups => [...prevGroups, newGroup]);
      setShowModal(false);
      setNewCourse({ title: "", mentor: "", overview: "" });
    }
  };

  const filteredGroups = groups.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.mentor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isOwner = (course: Group) => {
    return profile?.name === course.mentor;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-200"></div>
          <div className="text-slate-400">Loading groups...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Your Groups</h1>
            <p className="text-slate-600 mt-2">Discover and join learning communities</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search groups..."
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Course
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((course) => {
            const owned = isOwner(course);
            return (
              <div 
                key={course.id} 
                className={`bg-white rounded-xl shadow-sm border ${owned ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-slate-100'} 
                  p-6 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between 
                  ${owned ? 'bg-gradient-to-br from-white to-indigo-50/30' : ''}`}
                onClick={() => router.push(`/dashboard/groups/${course.id}`)}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-slate-800">
                        {course.title}
                      </h3>
                      {owned && (
                        <Crown className="w-4 h-4 text-indigo-600" />
                      )}
                    </div>
                    <span className={`px-3 py-1 ${owned ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'} text-sm rounded-full`}>
                      {owned ? 'Owner' : 'Member'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-slate-600">
                      <BookOpen className="w-4 h-4 mr-2" />
                      <p className="text-sm">Owner: {course.mentor}</p>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Users className="w-4 h-4 mr-2" />
                      <p className="text-sm">{course.students?.length || 0} Students</p>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {course.overview || 'Join this group to learn and collaborate with peers.'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-200 w-full">
                  <button 
                    className={`w-full px-4 py-2 rounded-lg transition-colors
                      ${owned ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/groups/${course.id}`);
                    }}
                  >
                    {owned ? 'Manage Course' : 'View Course'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Create New Group</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Group Title</label>
                  <input 
                    type="text" 
                    placeholder="Enter group title" 
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100" 
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} 
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Overview</label>
                  <textarea 
                    placeholder="Enter group overview" 
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 h-24" 
                    value={newCourse.overview}
                    onChange={(e) => setNewCourse({ ...newCourse, overview: e.target.value })} 
                    required
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)} 
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}