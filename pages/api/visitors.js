
import { redis } from '../../lib/redis';

export default async function handler(req, res) {
  try {
    const data = await redis.get('visitor_stats');
    let stats;

    if (!data) {
      // If no data in Redis, initialize stats
      stats = {
        total: 1,
        today: {
          date: new Date().toISOString().split('T')[0],
          count: 1,
        },
      };
    } else {
      // If data exists, parse it if it's a string, otherwise use it directly
      if (typeof data === 'string') {
        stats = JSON.parse(data);
      } else {
        stats = data;
      }
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = now.getUTCMonth();
      const day = now.getUTCDate();

      // Create a UTC date object for the start of the current UTC day
      const utcToday = new Date(Date.UTC(year, month, day));

      // Add 9 hours to get the KST equivalent
      utcToday.setUTCHours(utcToday.getUTCHours() + 9);

      // Now, format this adjusted date to YYYY-MM-DD
      const kstYear = utcToday.getUTCFullYear();
      const kstMonth = (utcToday.getUTCMonth() + 1).toString().padStart(2, '0');
      const kstDay = utcToday.getUTCDate().toString().padStart(2, '0');

      const today = `${kstYear}-${kstMonth}-${kstDay}`;

      stats.total += 1;

      if (stats.today.date === today) {
        stats.today.count += 1;
      } else {
        stats.today.date = today;
        stats.today.count = 1;
      }
    }

    // Save the updated stats back to Redis
    await redis.set('visitor_stats', JSON.stringify(stats));

    res.status(200).json({
      total: stats.total,
      today: stats.today.count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error handling visitor count' });
  }
}
