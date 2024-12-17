import { useState } from 'react';
import { useRouter } from 'next/router';
import { handleLogin } from '../services/api';
import axios  from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await handleLogin(formData);
  
      const accessToken = response.access_token;
      console.log('Access Token:', accessToken);
  
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        router.push('/');
        console.log('Access Token stored in localStorage:', accessToken);
      } else {
        console.error('Access token not received.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios error ise
        console.error('Login error (Axios):', error.response?.data || error.message);
      } else {
        // Diğer türde bir hata
        console.error('Login error:', (error as Error).message);
      }
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
