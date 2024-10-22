// const inquirer = 'inquirer';
// const { connect } = require('http2');
//const {connectToDb} = require('./db/connection');
// const { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, viewDepartmentBudget, logOut } = require('./utils/queries');


import inquirer from 'inquirer';    
import {pool as db,connectToDb} from './db/connections.js';

connectToDb()

// db.connection(err => {
//     if (err) throw err;
//     console.log('Database connected.');
//     employee_tracker();
// });

const employee_tracker = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Log Out']
    }]).then((answers) => {
        if (answers.prompt === 'View All Departments') {
            db.query('SELECT * FROM department', (err, results) => {
                if (err) throw err;
                console.log("Viewing All Departments:");
                console.table(results);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Roles') {
            db.query('SELECT * FROM role', (err, results) => {
                if (err) throw err;
                console.log("Viewing All Roles:");
                console.table(results);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Employees') {
            db.query('SELECT * FROM employee', (err, results) => {
                if (err) throw err;
                console.log("Viewing All Employees:");
                console.table(results);
                employee_tracker();
            });
        } else if (answers.prompt === 'Add Department') {
            inquirer.prompt([{
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Please enter the department name.');
                        return false;
                    }
                }
            }]).then((answers) => {
                db.query('INSERT INTO department (name) VALUES (?)', [answers.department], (err, results) => {
                    if (err) throw err;
                    console.log('Added ${answers.department} to the database.');
                    employee_tracker();
                });
            });
        } else if (answers.prompt === 'Add Role') {
            db.query('SELECT * FROM department', (err, results) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'role',
                        message: 'What is the name of the role?',
                        validate: roleInput => {
                            if (roleInput) {
                                return true;
                            } else {
                                console.log('Please enter the role name.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary of the role?',
                        validate: salaryInput => {
                            if (salaryInput) {
                                return true;
                            } else {
                                console.log('Please enter the salary.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'What department does the role belong to?',
                        choices: () => {
                            const array = [];
                            for (const result of results) {
                                array.push(result.name);
                            }
                            return array;
                        }
                    }
                ]).then((answers) => {
                    db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', 
                        [answers.role, answers.salary, department.id], (err, results) => {
                        if (err) throw err;
                        console.log(`Added ${answers.role} to the database.`);
                        employee_tracker();
                    });
                });
            });
        } else if (answers.prompt === 'Add Employee') {
            db.query('SELECT * FROM role', (err, results) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'What is the employee\'s first name?',
                        validate: first_nameInput => {
                            if (first_nameInput) {
                                return true;
                            } else {
                                console.log('Please enter the employee\'s first name.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'What is the employee\'s last name?',
                        validate: last_nameInput => {
                            if (last_nameInput) {
                                return true;
                            } else {
                                console.log('Please enter the employee\'s last name.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employees role?',
                        choices: () => {
                            const array = [];
                            for (const result of results) {
                                array.push(result.title);
                            }
                            return [...new Set(array)];
                        }
                    },
                    {
                        type: 'input',
                        name: 'manager',
                        message: 'Who is the employee\'s manager?',
                        validate: managerInput => {
                            if (managerInput) {
                                return true;
                            } else {
                                console.log('Please enter the employee\'s manager.');
                                return false;
                            }
                        }
                    }
                ]).then((answers) => {
                    let role;
                    for (const element of results) {
                        if (element.title === answers.role) {
                            role = element;
                        }
                    }

                    db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', 
                        [answers.first_name, answers.last_name, role.id, answers.manager], (err, results) => {
                        if (err) throw err;
                        console.log(`Added ${answers.first_name} ${answers.last_name} to the database.`);
                        employee_tracker();
                    });
                });
            });
        } else if (answers.prompt === 'Update Employee Role') {
            db.query('SELECT * FROM employee', (err, results) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee\'s role would you like to update?',
                        choices: () => {
                            const array = [];
                            for (const element of results) {
                                array.push(element.last_name);
                            }
                            const employeeArray = [...new Set(array)];
                            return employeeArray;
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employee\'s new role?',
                        choices: () => {
                            let array = [];
                            for (let result of results) {
                                array.push(result.title);
                            }
                            let newArray = [...new Set(array)];
                            return newArray;
                        }
                    }
                ]).then((answers) => {
                    let employee;
                    for (const element of results) {
                        if (element.last_name === answers.employee) {
                            employee = element;
                        }
                    }

                    let role;
                    for (const element of results) {
                        if (element.title === answers.role) {
                            role = element;
                        }
                    }

                    db.query('UPDATE employee SET role_id = ? WHERE id = ?', 
                        [role.id, employee.id], (err, results) => {
                        if (err) throw err;
                        console.log(`Updated ${answers.employee}'s role to database.`);
                        employee_tracker();
                    });
                });
            });
        } else if (answers.prompt === 'Department Budget') {
            db.query('SELECT * FROM department', (err, results) => {
                if (err) throw err;

                answers.salary = results;
                answers.salary.push({ name: 'All Salaries' });

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department\'s budget would you like to view?',
                        choices: () => {
                            let array = [];
                            for (const result of results) {
                                array.push(result.name);
                            }
                            return array;
                        }
                    },
                    {
                        type: 'list',
                        name: 'salary',
                        message: 'Which salary would you like to view?',
                        choices: () => {
                            const array = [];
                            for (const result of results) {
                                array.push(result.salary);
                            }
                            return array;
                        }
                    }
                ]).then((answers) => {
                    // Handle the department budget logic here
                    employee_tracker();
                    db.query('SELECT SUM(salary) AS total_salary FROM role WHERE department_id = ?', [department.id], (err, results) => {
                        if (err) throw err;
                        console.log(`Total budget for the department: ${results[0].total_salary}`);
                        employee_tracker();
                    });
                });
            });
        } else if (answers.prompt === 'Log Out') {
            db.end();
            console.log('Logging out.');
        }
    });
};

employee_tracker();