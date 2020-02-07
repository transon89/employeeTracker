USE employee_tracker;

INSERT INTO department(names)
VALUES ("Sales");

INSERT INTO department(names)
VALUES ("Engineering");

INSERT INTO department(names)
VALUES ("Finance");

INSERT INTO department(names)
VALUES ("Legal");

INSERT INTO role(title, salary, department_id)
VALUES ("Sales Lead", 20000, 1);
INSERT INTO role(title, salary, department_id)
VALUES ("Sales person", 60000, 1);

INSERT INTO role(title, salary, department_id)
VALUES ("Lead Engineer", 120000, 2);
INSERT INTO role(title, salary, department_id)
VALUES ("Junior dev", 80000, 2);

INSERT INTO role(title, salary, department_id)
VALUES ("Accountant", 110000, 3);

INSERT INTO role(title, salary, department_id)
VALUES ("Lawyer", 210000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Chris', 'Nguyen',1,null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Robert', 'Wang',1, 1);

INSERT INTO employee (first_name, last_name,role_id, manager_id)
VALUES ('Tommy', 'Nguyen',2,3);

INSERT INTO employee (first_name, last_name,role_id, manager_id)
VALUES ('Howard', 'Jones',3, null);

INSERT INTO employee (first_name, last_name,role_id, manager_id)
VALUES ('Joe', 'Biden',4, 3);

INSERT INTO employee (first_name, last_name,role_id, manager_id)
VALUES ('Stephen', 'Ho',3, 1);

INSERT INTO employee (first_name, last_name,role_id, manager_id)
VALUES ('Ron', 'Chen',4, 3);