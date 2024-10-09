const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());

const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const userSchema = new Schema
({
  firstName: String,
  surname: String,
  userName: String,
  idNumber: Number,
  country: String,
  mobileNumber: String,
  accNumber: String,  // hashed in the database
  password: String,  // hashed in the database
  budget: 
  {
    amount: { type: Number, default: 0 },
    currency: String
  },
  transactions: 
  [{
    name: String,
    amount: Number,
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['Withdrawal', 'Payment', 'Transfer', 'Deposit'] }
  }]
});

const User = mongoose.model('User', userSchema);

// array storing the brics countries to show that the api allows the app to run "internationally"
const countryMapping = 
{
  'Brazil': { code: '+55', currency: 'BRL' },
  'Russia': { code: '+7', currency: 'RUB' },
  'India': { code: '+91', currency: 'INR' },
  'China': { code: '+86', currency: 'CNY' },
  'South Africa': { code: '+27', currency: 'ZAR' }
};

function validatePassword(password) 
{
  const regex = /^(?=.*[A-Z])(?=.*\W)[a-zA-Z\d\W]{8,}$/;
  /* hashing protocol adhered by the ISO 27001 password requirements as stated by (Anwita, 2024) */
  /* Anwita (2024). 
    How to Implement ISO 27001 Password Policy in 2024. [online] Sprinto. 
    Available at: https://sprinto.com/blog/iso-27001-password-policy/ [Accessed 3 Oct. 2024]. */ 
  return regex.test(password);
}


app.post('/register', async (req, res) => 
    {
  const { firstName, surname, userName, idNumber, country, mobileNumber, accNumber, password } = req.body;

  if (!validatePassword(password)) 
    {
        return res.status(400).json({ error: 'Use at least 8 characters, an uppercase letter and at least one special character (!@#$ etc).' });
    }

  const hashedAccNumber = await bcrypt.hash(accNumber.toString(), 10);
  const hashedPassword = await bcrypt.hash(password, 10);

  const selectedCountry = countryMapping[country]; // method to get the country code and currency depedning on the selection by the user

  const newUser = new User
  ({
    firstName,
    surname,
    userName,
    idNumber,
    country,
    mobileNumber: selectedCountry.code + mobileNumber,
    accNumber: hashedAccNumber,
    password: hashedPassword,
    budget: { currency: selectedCountry.currency }
  });

  await newUser.save();
  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => 
    {
        const { userName, accNumber, password } = req.body;
        const user = await User.findOne({ userName });

            if (!user) return res.status(404).json({ error: 'User not found' });

                const isAccNumberMatch = await bcrypt.compare(accNumber.toString(), user.accNumber);
                const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (!isAccNumberMatch || !isPasswordMatch) {
        return res.status(400).json({ error: 'Password or account number is incorrect, please try again' });
  }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        res.json({ message: 'Login successful', token });
    });

app.post('/budget', async (req, res) => 
    {
        const { userId, amount } = req.body;

        const user = await User.findById(userId);
            if (!user) return res.status(404).json({ error: 'User not found' });

        user.budget.amount = amount;
             await user.save();
        res.json({ message: 'Budget updated successfully', budget: user.budget });
    });

app.post('/transactions', async (req, res) => 
    {
      const { userId, name, amount, type } = req.body;

      const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

 // if statement that changes the calculation done in the budget depending on the type of transaction selected by the user
  if (['Withdrawal', 'Payment', 'Transfer'].includes(type)) 
    {
        user.budget.amount -= amount;
    } 
else if (type === 'Deposit') 
    {
        user.budget.amount += amount;
    }

  user.transactions.push({ name, amount, type });
  await user.save();

  res.json({ message: 'Transaction added successfully', transactions: user.transactions });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => 
    {
        console.log(`Server running on port ${PORT}`);
    });
