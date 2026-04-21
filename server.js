require('dotenv').config();
const connectDB = require('./src/config/db');
const app = require('./src/config/app');

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
