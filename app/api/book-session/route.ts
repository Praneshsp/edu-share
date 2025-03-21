import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export async function POST(req : Request) {
  try {
    const body = await req.json();
    const { mentorName, userEmail, sessionDate, sessionTime } = body;

    // Validate input
    if (!sessionDate || !sessionTime || !userEmail || !mentorName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert sessionTime to 24-hour format
    const timeMatch = sessionTime.match(/(\d+)\s*(PM|AM)/i);
    if (!timeMatch) {
      return NextResponse.json(
        { message: 'Invalid time format' },
        { status: 400 }
      );
    }

    let hour = parseInt(timeMatch[1]);
    const period = timeMatch[2].toUpperCase();
    
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    const formattedTime = `${hour.toString().padStart(2, '0')}:00`;

    // Create start time
    const startTime = new Date(`${sessionDate}T${formattedTime}:00.000Z`);
    if (isNaN(startTime.getTime())) {
      return NextResponse.json(
        { message: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Generate OAuth2 Access Token
    const accessToken = await oauth2Client.getAccessToken();

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          type: 'OAuth2',
          user: process.env.EMAIL_FROM,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          accessToken: accessToken.token || '',
      },
  })

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: `Mentoring Session Confirmation with ${mentorName}`,
      html: `
        <h1>Greetings from EduShare!</h1>
        <h1>Your mentoring session is confirmed!</h1>
        <strong>Your Meet Link: https://meet.google.com/srx-ttvj-dkn</strong>
        <p><strong>Date:</strong> ${sessionDate}</p>
        <p><strong>Time:</strong> ${sessionTime}</p>
        <p><strong>Mentor:</strong> ${mentorName}</p>
      `,
    });

    return NextResponse.json({ message: 'Session booked successfully' });
  } catch (error) {
    console.error('❌ Error booking session:', error);
    return NextResponse.json(
      { message: 'Failed to book session', error: String(error) },
      { status: 500 }
    );
  }
}
