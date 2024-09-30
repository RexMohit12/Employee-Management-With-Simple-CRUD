const express = require('express');
const router = express.Router();
const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
} = require('../controllers/employee.controller'); // Adjust the path if needed

// Define your routes
router.get('/', getEmployees);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.get('/search', searchEmployees);

module.exports = router;
