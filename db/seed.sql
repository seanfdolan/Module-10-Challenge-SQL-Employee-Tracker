INSERT INTO department (name) VALUES
('Engineering'),
('Finance'),
('Legal'),
('Sales');

INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 100000, 1),
('Accountant', 75000, 2),
('Lawyer', 120000, 3),
('Salesperson', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Doe', 2, 1),
('Alice', 'Johnson', 3, NULL),
('Bob', 'Smith', 4, 3);


