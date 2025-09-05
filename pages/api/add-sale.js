import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST 요청만 허용됩니다.' });
  }

  const jsonDirectory = path.join(process.cwd(), 'public');
  const filePath = jsonDirectory + '/sales.json';

  try {
    // 기존 데이터 읽기
    const fileContents = await fs.readFile(filePath, 'utf8');
    const sales = JSON.parse(fileContents);

    // 새 ID 생성 (가장 큰 ID + 1)
    const maxId = sales.reduce((max, sale) => Math.max(max, sale.id), 0);
    const newId = maxId + 1;

    // 새 데이터 추가
    const newSale = {
      id: newId,
      brandName: req.body.brandName,
      saleTitle: req.body.saleTitle,
      saleStartDate: req.body.saleStartDate,
      saleEndDate: req.body.saleEndDate,
      locationType: req.body.locationType,
      onlineLink: req.body.onlineLink,
      offlineAddress: req.body.offlineAddress,
      details: req.body.details,
    };
    sales.push(newSale);

    // 파일에 다시 쓰기
    await fs.writeFile(filePath, JSON.stringify(sales, null, 2));

    res.status(200).json({ message: '성공적으로 등록되었습니다.', newSale });

  } catch (error) {
    res.status(500).json({ message: '데이터를 저장하는 중 오류가 발생했습니다.', error: error.message });
  }
}
