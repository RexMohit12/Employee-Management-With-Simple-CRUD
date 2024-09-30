const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const employeeRoute = require('./routes/employee.route.js');

// Initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/employees",employeeRoute);
// PostgreSQL pool setup
const pool = new Pool({
  user: 'postgres',      
  host: 'localhost',
  database: 'postgres',  
  password: 'admin12',  
  port: 5432,
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
