import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const cookie = serialize('admin-auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    });
    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ success: true });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
