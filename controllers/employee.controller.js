const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin12',
  port: 5432,
});

const createEmployee = async (req, res) => {
  const { firstname, lastname, age, city } = req.body; 
  try {
    const newEmployee = await pool.query(
      'INSERT INTO employees (firstname, lastname, age, city) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstname, lastname, age, city] 
    );
    res.json(newEmployee.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json('Server Error');
  }
};

const getEmployees = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default: page 1, 10 items per page
  const offset = (page - 1) * limit;

  try {
    // Get total count of employees
    const countResult = await pool.query('SELECT COUNT(*) FROM employees');
    const total = parseInt(countResult.rows[0].count, 10);

    // Get employees for the current page
    const employeesResult = await pool.query(
      'SELECT * FROM employees ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json({
      data: employeesResult.rows,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json('Server Error');
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, age, city } = req.body; // Include city
  try {
    const updatedEmployee = await pool.query(
      'UPDATE employees SET firstname = $1, lastname = $2, age = $3, city = $4 WHERE id = $5 RETURNING *',
      [firstname, lastname, age, city, id] // Include city in the query
    );
    if (updatedEmployee.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(updatedEmployee.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json('Server Error');
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM employees WHERE id = $1', [id]);
    res.json('Employee was deleted!');
  } catch (error) {
    console.error(error.message);
    res.status(500).json('Server Error');
  }
};

// New search function
const searchEmployees = async (req, res) => {
  const { term } = req.query; // Get the search term
  try {
    const employeesResult = await pool.query(
      `SELECT * FROM employees 
       WHERE firstname ILIKE $1 OR lastname ILIKE $1 OR CAST(age AS TEXT) ILIKE $1`,
      [`%${term}%`] // Use ILIKE for case-insensitive search
    );
    res.json({
      data: employeesResult.rows,
      totalItems: employeesResult.rowCount,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json('Server Error');
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees, // Export the new search function
};
