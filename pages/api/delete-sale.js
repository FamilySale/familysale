import { redis } from '../../lib/redis';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'DELETE 요청만 허용됩니다.' });
  }

  const { id } = req.query; // Get ID from query parameter
  if (!id) {
    return res.status(400).json({ message: '삭제할 세일의 ID가 필요합니다.' });
  }

  try {
    const sales = await redis.get('sales') || [];
    const initialLength = sales.length;
    const filteredSales = sales.filter(sale => sale.id !== parseInt(id, 10));

    if (filteredSales.length === initialLength) {
      return res.status(404).json({ message: '해당 ID의 세일 정보를 찾을 수 없습니다.' });
    }

    await redis.set('sales', filteredSales);

    res.status(200).json({ message: '세일 정보가 성공적으로 삭제되었습니다.' });

  } catch (error) {
    res.status(500).json({ message: '데이터를 삭제하는 중 오류가 발생했습니다.', error: error.message });
  }
}