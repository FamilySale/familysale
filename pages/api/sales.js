import { redis } from '../../lib/redis';

export default async function handler(req, res) {
  try {
    // Redis에서 'sales' 키의 값을 가져옵니다.
    const sales = await redis.get('sales');

    // 데이터가 없으면 빈 배열을 반환합니다.
    if (!sales) {
      return res.status(200).json([]);
    }

    // 가져온 데이터(JSON 문자열)를 객체로 파싱합니다.
    // 가져온 데이터(JSON 문자열)를 객체로 파싱하여 반환합니다.
    res.status(200).json(sales);

    // 정렬된 데이터를 JSON으로 반환합니다.
    res.status(200).json(parsedSales);
  } catch (error) {
    res.status(500).json({ message: '데이터를 가져오는 중 오류가 발생했습니다.', error: error.message });
  }
}