import { serialize } from 'cookie';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { password } = req.body;

    if (password === ADMIN_PASSWORD) {
      const cookie = serialize('admin-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
      res.setHeader('Set-Cookie', cookie);
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Incorrect password' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
