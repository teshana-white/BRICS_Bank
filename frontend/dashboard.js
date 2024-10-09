import React, { useEffect, useState } from 'react';
import { getBudget, makeSwiftPayment } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => 
    {
        const auth = useAuth();
        const [budget, setBudget] = useState(0);
        const [paymentData, setPaymentData] = useState({ name: 'Swift Payment', amount: 0 });
        const [error, setError] = useState('');

  useEffect(() => 
    {
        const fetchBudget = async () => 
            {
                try 
                {
                    const response = await getBudget(auth.user.token, auth.user.id);
                    setBudget(response.data.budget.amount);
                } 
                catch (error) 
                {
                    setError('Budget could not be found');
                }
            };
        fetchBudget();
    }, 
  [auth.user]);

  const handleChange = (e) => 
    {
        setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
    };

  const handleSwiftPayment = async (e) => 
    {
    e.preventDefault();
    try 
    {
      await makeSwiftPayment(auth.user.token, 
        {
            userId: auth.user.id,
            ...paymentData,
            type: 'Payment'
        });
      setBudget(budget - paymentData.amount);
    } 
    catch (error) 
    {
      setError('Payment failed');
    }
  };

  return (
    <div>
      <h1>Hello, {auth.user.userName}!</h1>
      <h2>Current Balance: {budget}</h2>
      <form onSubmit={handleSwiftPayment}>
        <input
          type="number"
          name="amount"
          placeholder="Payment Amount"
          onChange={handleChange}
          required
        />
        <button type="submit">Make Swift Payment</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Dashboard;
