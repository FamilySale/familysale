import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import { redis } from '../../../lib/redis';

function formatForDatetimeLocal(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Adjust for time zone offset
  const timeZoneOffset = date.getTimezoneOffset() * 60000; //in milliseconds
  const localDate = new Date(date.getTime() - timeZoneOffset);
  return localDate.toISOString().slice(0, 16);
}

export async function getServerSideProps(context) {
  const { req, params } = context;
  const isAuthenticated = req.cookies['admin-auth'] === 'true';

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  const sales = await redis.get('sales') || [];
  const sale = sales.find(s => String(s.id) === params.id);

  if (!sale) {
    return {
      notFound: true,
    };
  }

  return {
    props: { initialSale: sale },
  };
}

export default function EditSale({ initialSale }) {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (initialSale) {
      setFormData({
        ...initialSale,
        saleStartDate: formatForDatetimeLocal(initialSale.saleStartDate),
        saleEndDate: formatForDatetimeLocal(initialSale.saleEndDate),
      });
    }
  }, [initialSale]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('업데이트 중...');

    try {
      const res = await fetch(`/api/update-sale?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('성공적으로 업데이트되었습니다! 목록 페이지로 이동합니다.');
        setTimeout(() => router.push('/admin/register-list'), 2000);
      } else {
        const errorData = await res.json();
        setMessage(`업데이트 실패: ${errorData.message}`);
      }
    } catch (e) {
      setMessage(`업데이트 중 오류 발생: ${e.message}`);
    }
  };

  if (!formData) return <div className="container mt-5">로딩 중...</div>;

  return (
    <AdminLayout>
      <div className="container mt-5">
        <h1>세일 정보 수정</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="brandName" className="form-label">브랜드명</label>
            <input type="text" className="form-control" id="brandName" name="brandName" value={formData.brandName} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="saleTitle" className="form-label">세일 제목</label>
            <input type="text" className="form-control" id="saleTitle" name="saleTitle" value={formData.saleTitle} onChange={handleChange} required />
          </div>
          <div className="row mb-3">
              <div className="col">
                  <label htmlFor="saleStartDate" className="form-label">세일 시작일시</label>
                  <input type="datetime-local" className="form-control" id="saleStartDate" name="saleStartDate" value={formData.saleStartDate} onChange={handleChange} required />
              </div>
              <div className="col">
                  <label htmlFor="saleEndDate" className="form-label">세일 종료일시</label>
                  <input type="datetime-local" className="form-control" id="saleEndDate" name="saleEndDate" value={formData.saleEndDate} onChange={handleChange} required />
              </div>
          </div>
          <div className="mb-3">
              <label htmlFor="locationType" className="form-label">장소 구분</label>
              <select className="form-select" id="locationType" name="locationType" value={formData.locationType} onChange={handleChange}>
                  <option value="온라인">온라인</option>
                  <option value="오프라인">오프라인</option>
              </select>
          </div>
          {formData.locationType === '온라인' ? (
              <div className="mb-3">
                  <label htmlFor="onlineLink" className="form-label">온라인 링크</label>
                  <input type="url" className="form-control" id="onlineLink" name="onlineLink" value={formData.onlineLink} onChange={handleChange} placeholder="https://example.com/sale" />
              </div>
          ) : (
              <div className="mb-3">
                  <label htmlFor="offlineAddress" className="form-label">오프라인 주소</label>
                  <input type="text" className="form-control" id="offlineAddress" name="offlineAddress" value={formData.offlineAddress} onChange={handleChange} />
              </div>
          )}
          <div className="mb-3">
            <label htmlFor="details" className="form-label">상세 내용</label>
            <textarea className="form-control" id="details" name="details" rows="4" value={formData.details} onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="btn btn-primary me-2">업데이트</button>
          <button type="button" className="btn btn-secondary" onClick={() => router.push('/admin/register-list')}>취소</button>
        </form>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </AdminLayout>
  );
}
