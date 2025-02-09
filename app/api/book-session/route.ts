import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mentorName, userEmail, sessionDate, sessionTime } = body;

    // Validate input
    if (!sessionDate || !sessionTime) {
      return NextResponse.json(
        { message: 'Invalid date or time format' },
        { status: 400 }
      );
    }

    // Parse the time string
    // Convert "Tuesday 1 PM - 4 PM" to "13:00"
    const timeMatch = sessionTime.match(/(\d+)\s*(PM|AM)/i);
    if (!timeMatch) {
      return NextResponse.json(
        { message: 'Invalid time format' },
        { status: 400 }
      );
    }

    let hour = parseInt(timeMatch[1]);
    const period = timeMatch[2].toUpperCase();
    
    // Convert to 24-hour format
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    // Format hour to HH:mm format
    const formattedTime = `${hour.toString().padStart(2, '0')}:00`;

    // Create start time
    const startTime = new Date(`${sessionDate}T${formattedTime}:00.000Z`);
    if (isNaN(startTime.getTime())) {
      return NextResponse.json(
        { message: 'Invalid date format' },
        { status: 400 }
      );
    }

    // End time is 3 hours after start time (since the slot is 1 PM - 4 PM)
    const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);

    // 1. Send email notifications
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // TODO : ADD MENTOR EMAIL IN DB SCHEMA AND ADD THEM TO ATTENDEES HERE
    // TODO : GENERATE DYNAMIC INDIVIDUAL MEET LINK FOR EACH SESSION

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: `Mentoring Session Confirmation with ${mentorName}`,
      html: `
        <h1>Greetings from EduShare!</h1>
        <h1>Your mentoring session is confirmed!</h1>
        <strong>Your Meet Link : https://meet.google.com/srx-ttvj-dkn</strong>
        <p>Date: ${sessionDate}</p>
        <p>Time: ${sessionTime}</p>
        
        <p>Mentor: ${mentorName}</p>
      `,
    });

    return NextResponse.json({ message: 'Session booked successfully' });
  } catch (error) {
    console.error('Error booking session:', error);
    return NextResponse.json(
      { message: 'Failed to book session', error: String(error) },
      { status: 500 }
    );
  }
}