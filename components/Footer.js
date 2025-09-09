import { useState, useEffect } from 'react';

export default function Footer() {
  const [visitors, setVisitors] = useState({ total: 0, today: 0 });

  useEffect(() => {
    fetch('/api/visitors')
      .then((res) => res.json())
      .then((data) => {
        setVisitors(data);
      });
  }, []);

  return (
    <footer className="text-center mt-5 py-4 border-top">
      <p className="mb-1">© 치즈김밥 from 서산장터</p>
      <p className="mb-0">게재 문의: contact.familysale@gmail.com</p>
      <p className="text-muted small mt-2">게재된 정보의 열람, 구매 등의 행위로 발생하는 모든 일에 대한 책임은 전적으로 사용자에게 있습니다.</p>
      <div className="mt-3">
        <p className="mb-0 small text-muted">
          Today: {visitors.today} / Total: {visitors.total}
        </p>
      </div>
    </footer>
  );
}
