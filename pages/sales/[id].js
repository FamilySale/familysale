import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import path from 'path';
import { promises as fs } from 'fs';
import Countdown from '../../components/Countdown';
import Footer from '../../components/Footer';

// 날짜 포맷팅 함수
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export default function SaleDetail({ sale }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <Head>
        <title>{sale.saleTitle} - Family Sale</title>
        <meta name="description" content={sale.details} />
      </Head>

      <div className="mb-3 d-flex justify-content-end">
          <Link href="/" passHref>
            <button className="btn btn-outline-secondary">리스트로 돌아가기</button>
          </Link>
      </div>
      <main>
        <div className="row">
          
          <div className="col-md-12">
            <h5 className="text-muted">
              {new Date(sale.saleEndDate) < new Date() && <span className="text-danger">[종료] </span>}
              {sale.brandName}
            </h5>
            <h1>{sale.saleTitle}</h1>
            <hr />
            <p>
              {formatDateTime(sale.saleStartDate)} ~ {formatDateTime(sale.saleEndDate)}
              <Countdown endDate={sale.saleEndDate} />
            </p>
            
            {sale.locationType === '온라인' && sale.onlineLink && (
                <p>
                  <a href={sale.onlineLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    온라인 스토어 바로가기
                  </a>
                </p>
            )}

            {sale.locationType === '오프라인' && sale.offlineAddress && (
                <p>{sale.offlineAddress}</p>
            )}
            
            <hr />
            <p style={{ whiteSpace: 'pre-wrap' }}>{sale.details}</p>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

async function getSalesData() {
  const jsonDirectory = path.join(process.cwd(), 'public');
  const fileContents = await fs.readFile(jsonDirectory + '/sales.json', 'utf8');
  return JSON.parse(fileContents);
}

// 동적으로 생성될 페이지의 경로들을 정의합니다.
export async function getStaticPaths() {
  const sales = await getSalesData();
  const paths = sales.map((sale) => ({
    params: { id: String(sale.id) },
  }));

  return { paths, fallback: false };
}

// 각 페이지에 필요한 데이터를 가져옵니다.
export async function getStaticProps({ params }) {
  const sales = await getSalesData();
  const sale = sales.find(s => String(s.id) === params.id);

  return {
    props: {
      sale,
    },
  };
}