export default function handler(req, res) {
  if (req.cookies['admin-auth']) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
}
