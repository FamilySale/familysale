
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'visitor_count.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    let stats;
    if (err) {
      if (err.code === 'ENOENT') {
        // If the file doesn't exist, create it with initial stats
        stats = {
          total: 1,
          today: {
            date: new Date().toISOString().split('T')[0],
            count: 1,
          },
        };
      } else {
        console.error(err);
        return res.status(500).json({ error: 'Error reading visitor count file' });
      }
    } else {
      // If the file exists, parse the data and update stats
      stats = JSON.parse(data);
      const today = new Date().toISOString().split('T')[0];

      stats.total += 1;

      if (stats.today.date === today) {
        stats.today.count += 1;
      } else {
        stats.today.date = today;
        stats.today.count = 1;
      }
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
