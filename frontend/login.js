import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => 
    {
        const [credentials, setCredentials] = useState({ userName: '', accNumber: '', password: '' });
        const [error, setError] = useState('');
        const auth = useAuth();
        const navigate = useNavigate();

    const handleChange = (e) => 
        {
            setCredentials({ ...credentials, [e.target.name]: e.target.value });
        };

  const handleSubmit = async (e) => 
    {
        e.preventDefault();
    try 
    {
      const response = await loginUser(credentials);
      auth.login(response.data);
      navigate('/dashboard');
    } 
    catch (error) 
    {
      setError('Incorrect credentials');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="userName" placeholder="Username" onChange={handleChange} required />
        <input type="text" name="accNumber" placeholder="Account Number" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
