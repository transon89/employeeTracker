const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root", 
  password: "Rongho89$",
  database: "Employee_Tracker"
});

connection.connect(err => {
  if (err) throw err;
  start();
});

function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: chalk.underline
        .rgb(255, 127, 0)
        .bold("What would you like to do?"),
      choices: [
        "View all Employees",
        "View all Employees by Department",
        "View all Employees by Manger",
        "Add Employee",
        "Remove Employee",
        "Update Employee by role",
        "Update Employee by Manager",
        "exit"
      ]
    }) 
    .then(answer => {
      switch (answer.action) {
        case "View all Employees":
          viewEmployees();
          break;

        case "View all Employees by Department":
          viewByDepartment();
          break;
        case "View all Employees by Manger":
          viewByManager();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee by role":
          updateByRole();
          break;

        case "Update Employee by Manager":
          updateByManager();
          break;

        case "exit":
          connection.end();
          break;
      }
    });
}

function viewEmployees() {
  let query = ` SELECT e.id, e.first_name, e.last_name, r.title,r.salary,d.names as department, CONCAT(m.first_name," ", m.last_name) as manager
  FROM employee as e
  LEFT JOIN roles as r
  ON (e.role_id = r.id) LEFT JOIN department as d ON (r.id = d.id)
  LEFT JOIN employee as m on m.id = e.manager_id ORDER BY e.id;`;

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.table(res);
    start();
  });
}

function viewByDepartment() {
  let query = `SELECT * FROM department`;
  connection.query(query, (err,name)=> {
    if (err)throw err; 
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: chalk.underline
        .red
        .bold("Choose a Department"),
      choices:function(){
        let nameArr = [];
        for(let i = 0; i < name.length; i++){
          nameArr.push(name[i].names);
        }
        return nameArr;
      }
    })
    .then(answer => {
      let query =` Select e.id, e.first_name,e.last_name, d.names as department
      FROM employee as e 
      INNER JOIN department as d ON (e.id = d.id) WHERE d.names = ?`
     connection.query(query, [answer.choice],(err,res)=>{
       if(err) throw err;
       console.table(res);
       start();
     });      
    });
  });
}

function viewByManager() {
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: chalk.underline
        .red
        .bold("Choose a Manager"),
      choices: ["stephen", "tyler", "Tommy"]
    })
    .then(answer => {
      let query = `Select CONCAT(e.first_name, " ", e.last_name) as Employee,
      CONCAT(m.first_name," ", m.last_name) as Manager
      FROM employee as e 
      INNER JOIN employee as m ON e.manager_id = m.id `;
      connection.query(query, [answer.choice], (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        start();
      });
    });
}

function addEmployee() {
  connection.query(`SELECT * FROM roles `, function (err, result) {
    if (err) throw err;
    connection.query(`SELECT * FROM employee`, function (err, response) {
      if (err) throw err;

      inquirer
        .prompt([{
            name: "firstName",
            type: "input",
            message: chalk
              .red
              .italic("What is your employees first name?")
          },
          {
            name: "lastName",
            type: "input",
            message: chalk
              .greenBright
              .italic("What is your employees last name?")
          },
          {
            name: "role",
            type: "list",
            message: chalk
              .yellowBright
              .italic("What is your employee's role?"),
            choices: function () {
              let choiceArray = [];
              for (let i = 0; i < result.length; i++) {
                choiceArray.push(result[i].title);
              }
              return choiceArray;
            }
          },
          {
            name: "manager",
            type: "list",
            message: chalk
              .magentaBright
              .italic("Who is your new employee's manager?"),
            choices: function () {
              let manArr = [];
              for (let i = 0; i < response.length; i++) {
                manArr.push(response[i].first_name + " " + response[i].last_name + "_" + response[i].id);
              }
              return manArr;
            }
          }
        ])
        .then(answer => {
          let string = answer.manager;
          let splitResult = parseInt(string.split("_").pop());
          let chosenItem = "";
          for (let i = 0; i < result.length; i++) {
            if (answer.role === result[i].title) {
              chosenItem = parseInt(result[i].id);
            }
          }
          let query = `
     INSERT INTO employee(first_name, last_name, role_id, manager_id)
      VALUES (?, ?, ?,?)`;
          connection.query(
            query,
            [answer.firstName, answer.lastName, chosenItem, splitResult],
            (err, res) => {
              if (err) throw err;
              console.log("New Employee added to database!");
              start();
            }
          );
        });
    });
  });
}

function removeEmployee() {
  connection.query(`SELECT * FROM employee `, function (err, result) {
    if (err) throw err;

    inquirer
      .prompt([{
        name: "choice",
        type: "list",
        message: "choose an employee to remove",
        choices: function () {
          let choiceArray = [];
          for (let i = 0; i < result.length; i++) {
            choiceArray.push(result[i].first_name + " " + result[i].last_name);
          }
          return choiceArray;
        }
      }])
      .then(answer => {
        removedUser = "";
        for (let i = 0; i < result.length; i++) {
          if (result[i].first_name + " " + result[i].last_name === answer.choice) {
            removedUser = parseInt(result[i].id);
          }
        }

        let query = `DELETE FROM employee  WHERE id = ?`;
        connection.query(query, [removedUser]),
          (err, res) => {
            if (err) throw err;

          };
        console.log("Employee has been removed");

        start();
      });
  });
}

function updateByRole() {
  connection.query(`SELECT * FROM roles`, (err, roleType) => {
    if (err) throw err;

    connection.query(
      `SELECT e.first_name, e.last_name,e.role_id,r.title,r.id FROM employee as e 
  LEFT JOIN roles as r 
  ON e.role_id = r.id`,
      (err, response) => {
        if (err) throw err;

        inquirer
          .prompt([{
              name: "employee",
              type: "list",
              message: "choose an employee to update",
              choices: function () {
                let employeeArray = [];
                for (let i = 0; i < response.length; i++) {
                  employeeArray.push(
                    response[i].first_name + " " + response[i].last_name
                  );
                }
                return employeeArray;
              }
            },
            {
              name: "role",
              type: "list",
              message: "Choose a new role for this employee",
              choices: function () {
                let roleArr = [];
                for (let i = 0; i < roleType.length; i++) {
                  roleArr.push(roleType[i].title);
                }
                return roleArr;
              }
            }
          ])
          .then(answer => {
            connection.query(`SELECT id FROM roles WHERE ?`, {
                title: answer.role
              },
              function (err, res) {
                if (err) throw err;
                connection.query(`UPDATE roles SET title = ? WHERE id = ?`, [answer.role, res[0].id]),
                  function (err, res) {
                    if (err) throw err;
                    console.log("success");
                    
                  }
                  start();
              })
          });
      }
    );
  });
}