const express = require('express');
const routes = express.Router();
const authController  = require("../controllers/pages");
const { authRoleTeacher_Admin, authRoleAdmin, authAllRole } = require('../routes/furtherAuth');
const furtherAuth = require("../routes/furtherAuth");

routes.get("/", (req, res) => {
    res.render("index");
})

routes.get("/signup",(req,res) =>{
    res.render("signup");
})

routes.get("/login", (req,res)=>{
    res.render("login");
})

// When url ends with /home , render the html page
routes.get("/home", (req, res)=>{
    res.render("home");
})

// When url ends with /create_project , calls the function create_project and renders the page
routes.get("/create_project", authController.create_project);

// When url ends with /student_allocation , render the student_allocation page

routes.get("/student_allocation",authController.load_studentAllo);

// When url ends with /teacher_allocation , render the teacher_allocation page

routes.get("/teacher_allocation", authRoleAdmin ,(req,res) =>{
    res.render("teacher_allocation");
})

routes.get("/delete", authRoleTeacher_Admin ,(req,res) => {
    res.render("delete");
})

routes.get("/delete_account", authRoleAdmin ,authController.delete_account);

routes.get("/delete",(req,res) => {
    res.render("delete");
})

// function to check if user is logged in
function checkSession(req,res,dest,ret){
    if (req.session.loggedin){
        res.render(dest);
    } else {
        res.render(ret);
    }
}


module.exports = routes;