import Head from 'next/head';
import Link from 'next/link';

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

import Footer from '../components/Footer';

export default function Home({ sales }) {
  return (
    <div className="container mt-4">
      <Head>
        <title>Family Sale</title>
        <meta name="description" content="AI-powered family sale information" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="text-center mb-4">
          <img src="/logo.jpg" alt="Family Sale Logo" style={{ maxWidth: '250px', height: 'auto', width: '100%' }} />
        </div>

        <div className="row">
          {sales.map((sale) => (
            <div key={sale.id} className="col-12 mb-4">
              <Link href={`/sales/${sale.id}`} passHref>
                <div className="card h-100" style={{ cursor: 'pointer' }}>
                  <div className="card-body">
                    <p className="card-text text-muted small">
                      {new Date(sale.saleEndDate) < new Date() && <span className="text-danger">[종료] </span>}
                      {sale.brandName}
                    </p>
                    <h5 className="card-title">{sale.saleTitle}</h5>
                    <p className="card-text small">
                      {formatDateTime(sale.saleStartDate)} ~ {formatDateTime(sale.saleEndDate)}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { redis } from '../lib/redis';

export async function getServerSideProps({ res }) {
  res.setHeader('Cache-Control', 'no-store');
  let sales = await redis.get('sales');

  if (!Array.isArray(sales)) {
    sales = [];
  }

  // 등록된 순서 (ID 내림차순)로 정렬
  sales.sort((a, b) => b.id - a.id);

  return {
    props: {
      sales,
    },
  };
}
