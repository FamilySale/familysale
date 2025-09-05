import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  // public 디렉터리의 sales.json 파일 경로를 찾습니다.
  const jsonDirectory = path.join(process.cwd(), 'public');
  // sales.json 파일의 내용을 읽어옵니다.
  const fileContents = await fs.readFile(jsonDirectory + '/sales.json', 'utf8');
  // JSON으로 파싱합니다.
  const salesData = JSON.parse(fileContents);

  // 200 OK 상태 코드와 함께 JSON 데이터를 응답합니다.
  res.status(200).json(salesData);
}
