import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => 
    {
        const [userData, setUserData] = useState
        ({
            firstName: '',
            surname: '',
            userName: '',
            idNumber: '',
            country: '',
            mobileNumber: '',
            accNumber: '',
            password: ''
        });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => 
    {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

  const handleSubmit = async (e) => 
    {
        e.preventDefault();
    try 
    {
      await registerUser(userData);
      navigate('/login');
    } 
    catch (error) 
    {
      setError('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="surname" placeholder="Surname" onChange={handleChange} required />
        <input type="text" name="userName" placeholder="Username" onChange={handleChange} required />
        <input type="text" name="idNumber" placeholder="ID Number" onChange={handleChange} required />
        <select name="country" onChange={handleChange} required>
          <option value="">Select Country</option>
          <option value="Brazil">Brazil</option>
          <option value="Russia">Russia</option>
          <option value="India">India</option>
          <option value="China">China</option>
          <option value="South Africa">South Africa</option>
        </select>
        <input type="text" name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} required />
        <input type="text" name="accNumber" placeholder="Account Number" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
