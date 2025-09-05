import { redis } from '../../lib/redis';
import path from 'path';

export default async function handler(req, res) {
  const { promises: fs } = require('fs');
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'GET 요청만 허용됩니다.' });
  }

  try {
    // 1. sales.json 파일 읽기
    const jsonDirectory = path.join(process.cwd(), 'public');
    const filePath = path.join(jsonDirectory, 'sales.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const salesData = JSON.parse(fileContents);

    if (!salesData || salesData.length === 0) {
      return res.status(200).json({ message: 'sales.json에 데이터가 없어 마이그레이션을 건너뜁니다.' });
    }

    // 2. Redis에 데이터 저장
    // 기존 데이터를 덮어쓰기 위해 'sales' 키에 데이터를 set 합니다.
    await redis.set('sales', salesData);

    res.status(200).json({ message: '성공적으로 데이터를 Redis로 마이그레이션했습니다.', data: salesData });

  } catch (error) {
    res.status(500).json({ message: '마이그레이션 중 오류가 발생했습니다.', error: error.message });
  }
}
