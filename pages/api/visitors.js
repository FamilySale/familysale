
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'visitor_count.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error reading visitor count file' });
    }

    const stats = JSON.parse(data);
    const today = new Date().toISOString().split('T')[0];

    stats.total += 1;

    if (stats.today.date === today) {
      stats.today.count += 1;
    } else {
      stats.today.date = today;
      stats.today.count = 1;
    }

    fs.writeFile(filePath, JSON.stringify(stats, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error writing visitor count file' });
      }

      res.status(200).json({
        total: stats.total,
        today: stats.today.count,
      });
    });
  });
}
