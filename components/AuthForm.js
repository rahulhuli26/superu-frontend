import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function AuthForm({ type }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const url = `http://localhost:8000/api/auth/${type}`;
      const res = await axios.post(url, { email });
      console.log('--------res------>', res.data.token);
      localStorage.setItem('token', res.data.token);
      router.push('/workspace');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{type === 'signup' ? 'Sign Up' : 'Log In'}</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">
          Submit
        </button>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </form>
    </div>
  );
}
