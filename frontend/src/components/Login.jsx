import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/login',
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      localStorage.setItem('token', response.data.token);
      navigate('/admin');
    } catch (err) {
      alert('Invalid Credentials');
    }

    setUsername('');
    setPassword('');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#FEF1DA' }}
    >
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-gray-200 transition-transform hover:scale-[1.015]">
        <div className="flex justify-center">
          <img src={logo} alt="Company" className="h-16 w-auto mb-4" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-800 mb-8">
          Welcome Back 👋
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="Username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="Username"
              type="text"
              name="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-base placeholder-gray-400"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-base placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-500 transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
