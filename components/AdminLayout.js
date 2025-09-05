import { useRouter } from 'next/router';

const AdminLayout = ({ children }) => {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch('/api/admin-logout', {
      method: 'POST',
    });

    if (res.ok) {
      router.push('/admin/login');
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h2>Admin</h2>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </header>
      <main style={{ padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
