const { google } = require('googleapis');
const readline = require('readline');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Authorize this app by visiting this URL:', oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
}));

rl.question('Enter the code from that page here: ', async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log('Access Token:', tokens.access_token);
  console.log('Refresh Token:', tokens.refresh_token);
  rl.close();
});
