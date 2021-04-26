const mysql = require('mysql');
const inquirer = require('inquirer');
const ctable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employee_mgmtdb'
});





const addRow = (table, data) => {
    connection.query(`insert into ${table} set ?`, data, e => {
        if(e) throw e;
        console.log(`Row inserted into table ${table}.`);
        inqMain();
    })
}





const viewTable = (table) => {
    let viewQuery = `select * from ${table}`;
    if(table === 'role'){
        viewQuery = `select role.id, role.title, role.salary, department.name as 'department' from role left join department on role.department_id = department.id`
    }else
    if(table === 'employee'){
        viewQuery = `select employee.id, employee.first_name as 'name', employee.last_name as 'surname', role.title as 'role', employee.manager_id as 'manager' from employee left join (department, role) on (role.department_id = department.id and employee.role_id = role.id)`
    }
    return connection.query(viewQuery, (e, res) => {
        if(e) throw e;
        console.table(res);
        inqMain();
    });
}





const updateEmployee = (employeeID, data) => {
    connection.query(`update employee set ? where id = ${employeeID}`, data, (e,res) => {
        if(e) throw e;
        connection.query(`select * from employee where id = ${employeeID}`, (e, result) => {
            console.table(result);
            inqMain();
        })
    })
}





const addHandler = (res) => {
    switch(res.choice){
    case 'Department':
        inquirer.prompt([
        {
            message: 'Department Name?',
            type: 'input',
            name: 'name'
        }
        ]).then(res => {
            console.log(res);
            addRow('department', res);
        });
    break;
    /** ------------------- */
    case 'Role':
        inquirer.prompt([
        {
            message: 'Role Title?',
            type: 'input',
            name: 'title'
        },{
            message: 'Role Salary?',
            type: 'number',
            name: 'salary'
        },{
            message: 'Department ID?',
            type: 'number',
            name: 'department_id'
        }
        ]).then(res => {
            console.log(res);
            addRow('role', res);
        })
    break;
    /** ------------------- */
    case 'Employee':
        inquirer.prompt([
            {
                name: 'first_name',
                message: 'Employee First Name?',
                type: 'input'
            },{
                name: 'last_name',
                message: 'Employee Last Name?',
                type: 'input'
            },{
                name: 'role_id',
                type: 'number',
                message: 'Role ID?'
            },{
                name: 'manager_id',
                type: 'number',
                message: 'Manager ID?'
            }
        ]).then(res => {
            console.log(res);
            addRow('employee', res);
        })
    break;
    }
}




const viewHandler = (res) => {
    switch(res.choice){
    case 'Departments':
        viewTable('department');
    break;
    /** ------------------- */
    case 'Roles':
        viewTable('role')
    break;
    /** ------------------- */
    case 'Employees':
        viewTable('employee')
    break;
    }
}





const updateHandler = (res) => {
    switch (res.choice) {
    case 'Employee': 
        inquirer.prompt([
            {
                message: 'ID of Employee?',
                name: 'id',
                type: 'number'
            },{
                message: 'New Role ID',
                name: 'role_id',
                type: 'number'
            },{
                message: 'New Manager ID',
                name: 'manager_id',
                type: 'number'
            }
        ]).then(res => {
            const id = res.id;
            delete res.id;
            updateEmployee(id, res)
        })
    break;
    }
}

const inqMain = () => {
    inquirer.prompt([
    {
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['Add', 'View', 'Update', 'Exit']
    }
    ]).then(res => {
    switch (res.action) {
    case 'Add':
        inquirer.prompt([{
            message: 'What would you like to add?',
            type: 'list',
            name: 'choice',
            choices: ['Department', 'Role', 'Employee']
        }]).then(input => {
            addHandler(input);
        }).then(out =>{})
    break;
/** ------------------- */
    case 'View':
        inquirer.prompt([{
            message: 'What would you like to view?',
            type: 'list',
            name: 'choice',
            choices: ['Departments', 'Roles', 'Employees']
        }]).then(input => {
            viewHandler(input);
        }).then(out => {})
    break;
/** ------------------- */
    case 'Update':
        inquirer.prompt([{
            message: 'What would you like to update?',
            type: 'list',
            name: 'choice',
            choices: ['Employee']
        }]).then(input => {
            updateHandler(input);
        }).then(out => {})
    break;
/** ------------------- */
    default:
        done = true;
        connection.end();
    }
    })
}

connection.connect((err) => {
    if(err) throw err;
    inqMain();
})