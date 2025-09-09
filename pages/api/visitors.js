
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
      // If data exists, parse it and update
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
