
INSERT INTO department (name)
VALUES ('Kitchen'), ('FOH');

INSERT INTO role (title, salary, department_id)
VALUES ('Cook', 28000, 1), ('Dishwasher', 22000, 1), ('Host', 18000, 2), ('Waitress', 18000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Suzy', 'Exampleton', 1, 1), ('Mark', 'Washerly', 2, 1), ('John', 'Smith', 4, 1);