'use client'
interface Mentor {
  id: string;
  user_ids: string[]; // Changed from single user_id to array of user_ids
  full_name: string;
  expertise: string[];
  bio: string;
  hourly_rate: number;
  availability: string[];
  profile_image_url: string;
  created_at: string;
}

interface SessionRequest {
  id: string;
  mentor_id: string;
  user_email: string;
  session_date: string;
  session_time: string;
  status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
}

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import { SelectSingleEventHandler } from "react-day-picker";


const MentorCard = ({ 
  mentor, 
  onBook 
}: { 
  mentor: Mentor;
  onBook: (mentor: Mentor) => void;
}) => {
  return (
    <Card className="w-full max-w-sm oe shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <Image
            src={mentor.profile_image_url || '/api/placeholder/150/150'}
            alt={mentor.full_name}
            layout="fill"
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold">{mentor.full_name}</h3>
          <p className="text-gray-600">INR {mentor.hourly_rate}/hour</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{mentor.bio}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {mentor.expertise.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Available Times:</h4>
          <div className="flex flex-wrap gap-2">
            {mentor.availability.map((time) => (
              <span key={time} className="px-2 py-1 bg-gray-100 rounded">
                {time}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => onBook(mentor)}
        >
          Book Session
        </Button>
      </CardFooter>
    </Card>
  );
};


export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [bookingTime, setBookingTime] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [user,setUser] = useState<any>();
  // Inside the component:
const handleDateSelect: SelectSingleEventHandler = (day: Date | undefined) => {
  if (day) {
    setBookingDate(day);
  }
};

  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchMentors();
    fetchUser();
  }, []);

  async  function fetchUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }
  async function fetchMentors() {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMentors(data || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mentors. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }
  
  async function addUserToMentor(mentorId: string, userId: string) {
    try {
      // First get the current user_ids array
      const { data: mentor, error: fetchError } = await supabase
        .from('mentors')
        .select('user_ids')
        .eq('id', mentorId)
        .single();
  
      if (fetchError) throw fetchError;
  
      // Check if user is already in the array
      if (mentor.user_ids.includes(userId)) {
        toast({
          title: 'Info',
          description: 'You have already booked this mentor.',
        });
        return;
      }
  
      // Update the mentor's user_ids array by appending the new userId
      const { error: updateError } = await supabase
        .from('mentors')
        .update({
          user_ids: [...mentor.user_ids, userId]
        })
        .eq('id', mentorId);
  
      if (updateError) throw updateError;
  
      toast({
        title: 'Success',
        description: 'Successfully added to mentor\'s student list.',
      });
  
    } catch (error) {
      console.error('Error updating mentor:', error);
      toast({
        title: 'Error',
        description: 'Failed to update mentor information.',
        variant: 'destructive',
      });
    }
  }
  
  async function handleBookSession(e: React.FormEvent) {
    e.preventDefault();
    
    if (!selectedMentor || !bookingDate || !bookingTime || !userEmail) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
  
    try {
      // Get the current user's ID (you'll need to implement user authentication)
      const userId = user.id; // Replace with actual user ID from your auth system
      
      // Add user to mentor's user_ids array
      await addUserToMentor(selectedMentor.id, userId);
      const response = await fetch('/api/book-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: selectedMentor.id,
          mentorName: selectedMentor.full_name,
          userEmail: userEmail,
          sessionDate: bookingDate.toISOString().split('T')[0],
          sessionTime: bookingTime,
        }),
      });

      if (!response.ok) throw new Error('Failed to book session');

      toast({
        title: 'Success',
        description: 'Session request sent! Check your email for confirmation.',
      });

      // Reset form
      setSelectedMentor(null);
      setBookingDate(null);
      setBookingTime('');
      setUserEmail('');
      
    } catch (error) {
      console.error('Error booking session:', error);
      toast({
        title: 'Error',
        description: 'Failed to book session. Please try again.',
        variant: 'destructive',
      });
    }
  }


  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Mentor Sessions</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onBook={setSelectedMentor}
              />
            ))}
          </div>
        )}

        <Dialog open={!!selectedMentor} onOpenChange={() => setSelectedMentor(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Book a Session with {selectedMentor?.full_name}</DialogTitle>
              <DialogDescription>
                Choose your preferred date and time for the mentoring session.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleBookSession} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={bookingDate ?? undefined}
                  onSelect={handleDateSelect} 
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Select Time</Label>
                <select
                  id="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full rounded-md border p-2"
                  required
                >
                  <option value="">Select a time...</option>
                  {selectedMentor?.availability.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full">
                Confirm Booking
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}