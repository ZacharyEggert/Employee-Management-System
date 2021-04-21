const mysql = require('mysql');
const inquirer = require('inquirer');

let done = false;

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Brulee98',
    database: 'employee_mgmtDB'
});

const addRow = (table, data) => {
    connection.query('insert into ? set ?', [table, data], e => {
        if(e) throw e;
        console.log(`Row inserted into table ${table}.`);
    })
}

const viewTable = (table) => {
    connection.query(`select * from ${table}`, (e, res) => {
        if(e) throw e;
        console.log(res);
    });
}

const updateEmployee = (employeeID, field, data) => {
    connection.query('update employee set ? where id = ?', [{[field]:data}, employeeID])
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
    addRow('department', res);
});
break;
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
    message: 'Department ID/Name?',
    type: 'input',
    name: 'department_'
}
]).then(res => {
    if(!isNaN(res['department_'] * 1)){
        res['department_id'] = res['department_'] * 1;
        console.log(res)
        delete res['department_'];
        console.log(res);
        addRow('role', res);
    }else{
        try {
            connection.query('select * from department where name = "' + res['department_'] + '"', (e, data) => {
                if(e) throw e;
                console.log(res)
                res['department_id'] = data[0].id;
                delete res['department_'];
                console.log(res)
                addRow('role', res);
            })
        } catch (error) {
            console.log(error);
        }
    }
})
break;
case 'Employee':

break;
}
}
const viewHandler = (res) => {
switch(res.choice){
case 'Departments':

break;
case 'Roles':

break;
case 'Employees':

break;
}
}
const updateHandler = (res) => {

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
        }).then(out => console.log(out??"Data written."))
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
        }).then(out => console.log(out))
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
        }).then(out => console.log(out))
    break;
/** ------------------- */
    default:
        done = true;
        connection.end();
    }
    })
}