drop database if exists employee_mgmtDB;

create database employee_mgmtDB;

use employee_mgmtDB;

create table employee(
    id int auto_increment not null primary key,
    first_name varchar(30),
    last_name varchar(30),
    role_id int,
    manager_id int
);

create table role(
    id int auto_increment not null primary key,
    title varchar(30),
    salary decimal,
    department_id int
);

create table department(
    id int auto_increment not null primary key,
    name varchar(30)
);