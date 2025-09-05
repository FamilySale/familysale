import { redis } from '../../lib/redis';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'PUT 요청만 허용됩니다.' });
  }

  const { id } = req.query; // Get ID from query parameter
  const updatedSaleData = req.body; // Get updated data from request body

  if (!id) {
    return res.status(400).json({ message: '수정할 세일의 ID가 필요합니다.' });
  }

  try {
    const sales = await redis.get('sales') || [];
    const saleIndex = sales.findIndex(sale => sale.id === parseInt(id, 10));

    if (saleIndex === -1) {
      return res.status(404).json({ message: '해당 ID의 세일 정보를 찾을 수 없습니다.' });
    }

    // Update the sale, preserving the original ID
    sales[saleIndex] = { ...sales[saleIndex], ...updatedSaleData, id: parseInt(id, 10) };

    await redis.set('sales', sales);

    res.status(200).json({ message: '세일 정보가 성공적으로 업데이트되었습니다.', updatedSale: sales[saleIndex] });

  } catch (error) {
    res.status(500).json({ message: '데이터를 업데이트하는 중 오류가 발생했습니다.', error: error.message });
  }
}