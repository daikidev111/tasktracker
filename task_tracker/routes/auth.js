const express = require('express');
const authController = require("../controllers/auth");

const routes = express.Router();

routes.post('/signup', authController.signup);

routes.post('/login', authController.login);

routes.post('/logout', authController.logout);

routes.post('/create_project', authController.project);

routes.post('/student_allocation', authController.allocate);

routes.post('/student_deallocation', authController.deallocate);

routes.post('/details', authController.details)

routes.post('/teacher_allocation', authController.allocateTeacher);

routes.post('/delete_account', authController.deleteAccount);

routes.post('/delete', authController.deleteProject);

routes.post('/add_task', authController.addTask);

routes.post('/add_comment', authController.addComment);

routes.post('/enter_actual_time', authController.enter_Actual_Time)

routes.post('/change_task', authController.change_Task)

routes.post('/addExpected', authController.add_Expected);

routes.post('/draw_chart', authController.draw_Chart);

module.exports = routes;