import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      const { returnUrl } = router.query;
      router.push(returnUrl || '/admin/register-list');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '100px auto' }}>
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>
          Login
        </button>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </form>
    </div>
  );
}
