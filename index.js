const cors = require('cors'); // Import the CORS package
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb+srv://mauryaaditya00:123abc@backend.tt7hu.mongodb.net/ECG');

app.use(bodyParser.json());

// Define the Mongoose schema and model
const ecgValueSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const EcgValue = mongoose.model('EcgValue', ecgValueSchema);

// POST request to store ECG value in MongoDB
app.post('/data', async (req, res) => {
  try {
    const { value } = req.body;
    if (!value) {
      return res.status(400).send('Value is required');
    }

    const ecgValue = new EcgValue({ value });
    await ecgValue.save();
    res.status(201).send('Data saved successfully');
  } catch (err) {
    res.status(500).send('Error saving data');
  }
});

// GET request to retrieve the last 20 ECG values
app.get('/data', async (req, res) => {
  try {
    const values = await EcgValue.find().sort({ timestamp: -1 }).limit(20);
    res.status(200).json(values);
  } catch (err) {
    res.status(500).send('Error fetching data');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});
