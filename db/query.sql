SELECT department.name AS department, role.title, employee.first_name, employee.last_name, role.salary
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id;


select * from department;


select * from role;



select * from employee;