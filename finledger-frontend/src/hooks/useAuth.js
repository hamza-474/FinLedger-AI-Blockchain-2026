import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { loginApi, registerApi, getMeApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useAuthHook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login: setAuthContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginApi(email, password);
      localStorage.setItem('token', response.data.token);
      const userResponse = await getMeApi();
      setAuthContext(response.data.token, userResponse.data);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      let message = 'Login failed. Please check your credentials.';
      if (!err.response) {
        message = 'Cannot connect to server. Please ensure the backend is running.';
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (name, email, password, organization) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerApi(name, email, password, organization);
      localStorage.setItem('token', response.data.token);
      const userResponse = await getMeApi();
      setAuthContext(response.data.token, userResponse.data);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      let message = 'Registration failed. Please try again.';
      if (!err.response) {
        message = 'Cannot connect to server. Please ensure the backend is running.';
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { login: handleLogin, register: handleRegister, loading, error };
};
