import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';
import path from 'path';
import { promises as fs } from 'fs';

export async function getServerSideProps(context) {
  const { req } = context;
  const isAuthenticated = req.cookies['admin-auth'] === 'true';

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  const jsonDirectory = path.join(process.cwd(), 'public');
  const fileContents = await fs.readFile(jsonDirectory + '/sales.json', 'utf8');
  const sales = JSON.parse(fileContents);
  sales.sort((a, b) => b.id - a.id);

  return {
    props: { initialSales: sales },
  };
}

export default function RegisterList({ initialSales }) {
  const [sales, setSales] = useState(initialSales);

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 세일 정보를 삭제하시겠습니까?')) {
      try {
        const res = await fetch(`/api/delete-sale?id=${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || '삭제 실패');
        }

        setSales(sales.filter(sale => sale.id !== id));
        alert('세일 정보가 성공적으로 삭제되었습니다.');
      } catch (e) {
        alert(`삭제 실패: ${e.message}`);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-5">
        <h1>세일 정보 관리</h1>
        <Link href="/admin/register" className="btn btn-primary mb-3">
          새 세일 등록
        </Link>
        {sales.length === 0 ? (
          <p>등록된 세일 정보가 없습니다.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>브랜드명</th>
                <th>세일 제목</th>
                <th>시작일</th>
                <th>종료일</th>
                <th>장소</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.id}</td>
                  <td>{sale.brandName}</td>
                  <td>{sale.saleTitle}</td>
                  <td>{new Date(sale.saleStartDate).toLocaleDateString()}</td>
                  <td>{new Date(sale.saleEndDate).toLocaleDateString()}</td>
                  <td>{sale.locationType}</td>
                  <td>
                    <Link href={`/sales/${sale.id}`} className="btn btn-info btn-sm me-2">
                      보기
                    </Link>
                    <Link href={`/admin/edit-sale/${sale.id}`} className="btn btn-warning btn-sm me-2">
                      수정
                    </Link>
                    <button onClick={() => handleDelete(sale.id)} className="btn btn-danger btn-sm">
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}