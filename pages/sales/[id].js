import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
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

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('본 페이지의 URL을 복사했습니다. 원하는 곳에 붙여넣어 주세요.');
    } catch (err) {
      console.error('URL 복사에 실패했습니다.', err);
      alert('URL 복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <Head>
        <title>{sale.saleTitle} - Family Sale</title>
        <meta name="description" content={sale.details} />
        <meta property="og:title" content={sale.saleTitle} />
        <meta property="og:description" content={`브랜드: ${sale.brandName} | 기간: ${formatDateTime(sale.saleStartDate)} ~ ${formatDateTime(sale.saleEndDate)}`} />
        <meta property="og:url" content={`https://familysale.vercel.app/sales/${sale.id}`} />
        <meta property="og:image" content="https://familysale.vercel.app/logo.jpg" />
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
            
            <div className="d-flex gap-2 mb-3">
              {sale.locationType === '온라인' && sale.onlineLink && (
                  <a href={sale.onlineLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    온라인 스토어 바로가기
                  </a>
              )}
              <button onClick={copyUrlToClipboard} className="btn btn-secondary">
                공유하기
              </button>
            </div>

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

import { redis } from '../../lib/redis';

// 각 페이지에 필요한 데이터를 가져옵니다.
export async function getServerSideProps({ params }) {
  const sales = await redis.get('sales') || [];
  const sale = sales.find(s => String(s.id) === params.id);

  if (!sale) {
    return {
      notFound: true, // sale을 찾지 못하면 404 페이지를 보여줍니다.
    };
  }

  return {
    props: {
      sale,
    },
  };
}