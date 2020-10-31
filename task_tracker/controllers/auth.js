const db = require("../connect");

const pool = db();
const bcrpyt = require('bcryptjs');
const { text } = require("express");

exports.signup = (req, res) => {
    // Data acquired from the form
    let { username, password, confirmPw } = req.body;

    // Searches the database
    pool.getConnection((err,database)=>{
        database.query("SELECT username FROM users WHERE username = ?", [username], async (error, result) => {
            if (error) {
                console.log(error);
            } else if (result.length > 0) {
                return res.render('signup', {
                    prompt: "Username already exists"
                })
            } else if (password != confirmPw) {
                return res.render('signup', {
                    prompt: "Password and confirm password do not match"
                })
            } else if (!username || !password || !confirmPw) {
                return res.render('signup', {
                    prompt: "Please make sure every field is provided with a valid input!"
                })
            }
    
            // Hashing the password
            let hashedPassword = await bcrpyt.hash(password, 8);
    
            // Inserts data into database (username and password)
            database.query("INSERT INTO student_project SET ?", { username: username }, (error, result) => {
    
            })
    
            database.query("INSERT INTO users SET ?", { username: username, password: hashedPassword }, (error, result) => {
                if (result) {
                    return res.render('signup', {
                        success: "User successfully registered"
                    })
                }
            })
        })
        database.release();
    })
}


exports.login = (req, res) => {
    try {
        let { username, password } = req.body;
        let permission = "";

        if (!username || !password) {
            return res.render("login", {
                prompt: "Please enter username and password!"
            })
        } else {
            // Queries database based on input in the login form
            pool.getConnection((err,database)=>{
                database.query("SELECT * FROM users WHERE username = ?", [username], async (error, result) => {
                    if (error) {
                        console.log(error);
                    } else if (!result.length > 0 || !(await bcrpyt.compare(password, result[0].password))) {
                        return res.render("login", {
                            prompt: "Invalid username or passsword!"
                        })
                    } else if (await bcrpyt.compare(password, result[0].password) && result[0].username == username) {
                        permission = result[0].permission;
    
                        //Setting session data for logged in users
                        req.session.loggedin = true;
                        req.session.userdata = { username, password, permission };
                        res.cookie('username', username)
    
                        // If successful login go to create_project page
                        res.status(200).redirect("/create_project");
    
                    }
                })
                database.release();
            })
        }

    } catch (error) {
        console.log(error);
    }
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.render("index");
}

exports.project = (req, res) => {
    if (!req.body.project_name || !req.body.description) {
        return res.send({
            success: false,
            text: "Please make sure project name and description is filled in!"
        })
    } else {
        pool.getConnection((err,database)=>{
            database.query("SELECT * FROM project WHERE project_name = ?", [req.body.project_name], (error, result) => {
                if (result.length > 0) {
                    return res.send({
                        success: false,
                        text: "Project with the same name already exists"
                    })
                } else {
                    database.query("INSERT INTO project SET ?", { project_name: req.body.project_name, description: req.body.description }, (error, result) => {
                    })
                    return res.send({
                        success: true,
                        text: "Project successfully created"
                    })
                }
            })
            database.release();
        })
    }
}

exports.details = (req, res) => {
    let { project_id } = req.body;
    pool.getConnection((err,database)=>{
        database.query("SELECT * FROM project WHERE id = ?", [project_id], (error, result) => {
            if (error) {
                console.log(error);
            } else if (result.length > 0) {
                // Foo Yun Sheng
                res.cookie("project", result[0].project_name)
                task = JSON.parse(result[0].task)
                if (task != null) {
                    res.cookie("task", task[0])
                    res.cookie("alltasks",task)
                }
                else{
                    res.cookie("task", "")
                }
                req.session.projectdata = result[0];
                res.send({ data: result[0] });
            }
        })
        database.release();
    })
}

exports.allocate = async (req, res) => {
    let username = req.body.student;
    let project_name = req.session.projectdata.project_name;

    pool.getConnection((err,database)=>{
        database.query("SELECT * FROM project WHERE project_name = ?", [project_name], (error, result) => {
            if (error) {
                console.log(error);
            } else {
                let allocated_students = "";
                allocated_students = result[0].allocated_students;

                let allocated_studentsArr = [];
                allocated_studentsArr = allocated_students.split(",");

                //10 user limit validation
                if (allocated_studentsArr.length >= 10) {
                    return res.send({
                        prompt: "A project cannot have more than 10 students in it!"
                    })
                } else {
                    // Allocating student to the project
                    database.query("UPDATE student_project SET project_name = ? WHERE username = ?", [project_name, username], (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                    })
                    let allocated_students = "";
                    database.query("SELECT * FROM project WHERE project_name = ?", [project_name], (error, result) => {
                        if (error) {
                            console.log(error);
                        } else {
                            allocated_students = result[0].allocated_students;
                            if (allocated_students.length == 0) {
                                allocated_students += `${username}`;
                            } else {
                                allocated_students += `,${username}`;
                            }
                            database.query("UPDATE project SET allocated_students = ? WHERE project_name = ?", [allocated_students, project_name], (error, result) => {
                                if (error) {
                                    console.log(error);
                                }
                            })
                        }
                        return res.send("");
                    })
                }
            }
            database.release();
        })
    })
}

exports.deallocate = (req, res) => {
    let username = req.body.student;
    let project_name = req.session.projectdata.project_name;

    pool.getConnection((err,database)=>{
        database.query("UPDATE student_project SET project_name = ? WHERE username = ?", ['', username], (error, result) => {
            if (error) {
                console.log(error);
            }
        });

        database.query("SELECT * FROM project WHERE project_name = ?", [project_name], (error, result) => {
            if (error) {
                console.log(error);
            } else {
                let allocated_students = "";
                let allocated_studentsArr = [];
                allocated_students = result[0].allocated_students;
                allocated_studentsArr = allocated_students.split(",");
                for (let i = 0; i < allocated_studentsArr.length; i++) {
                    if (allocated_studentsArr[i] == username) {
                        allocated_studentsArr.splice(i, 1);
                    }
                }
                allocated_students = allocated_studentsArr.join(",");

                database.query("UPDATE project SET allocated_students = ? WHERE project_name = ?", [allocated_students, project_name], (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                })

                res.send("");
            }
        })
        database.release();
    })
}

exports.allocateTeacher = (req, res) => {
    // Data acquired from the form
    let { teacherName } = req.body;
    // Searches the database
    pool.getConnection((err,database)=>{
        database.query("SELECT * FROM users WHERE username = ?", [teacherName], async (error, result) => {
            if (result.length == 0) {
                return res.render("teacher_allocation", {
                    prompt: "This teacher does not exist"
                })
            } else {
                database.query("UPDATE users SET permission = ? WHERE username = ?", ["teacher", teacherName], async (error, result) => {
                    return res.render('teacher_allocation', {
                        success: "Teacher permission successfully updated"
                    })
                })
            }
        })
        database.release();
    })
}


exports.deleteAccount = (req, res) => {
    let { username, confirm_username } = req.body;


    if (username == confirm_username && username !== req.cookies.username) {
        pool.getConnection((err,database)=>{
            database.query("DELETE FROM users WHERE username = ? AND permission = 'student'", [username], (error, result) => {
                let account = [];
                database.query("SELECT * FROM users", (error2, result2) => {
                    if (result2.length > 0) {
                        for (let i = 0; i < result2.length; i++) {
                            account.push(result2[i]);
                        }
                        if (error) {
                            return res.render('delete_account', {
                                prompt: "Error!",
                                account: account
                            })
                        } else if (result.length == 0) {
                            return res.render('delete_account', {
                                prompt: "Student name you entered does not exist.",
                                account: account
                            })
                        } else {
                            return res.render('delete_account', {
                                success: "Successfully deleted",
                                account: account
                            })
                        }
                    }
                })
            })
            database.query("UPDATE student_project SET username = ? WHERE username = ?", ['', username], (error, result) => {
                if (error) {
                    console.log(error);
                }
            })
            database.release();
        })

    } else {
        if(username == req.cookies.username) {
            return res.render('delete_account', {
                prompt: "You cannot delete yourself!"
            })
        } else if(username !== confirm_username) {
            return res.render('delete_account', {
                prompt: "The student name you entered does not match "
            })
        } else {
            return res.render('delete_account', {
                prompt: "Error!"
            })
        }
    }


}

exports.deleteProject = (req, res) => {
    let { project_name } = req.body;

    pool.getConnection((err,database)=>{
        database.query("DELETE FROM project WHERE project_name = ?", [project_name], (error, result) => {
            if (error) {
                console.log(error);
            }
        })

        database.query("UPDATE student_project SET project_name = ? WHERE project_name = ?", ['', project_name], (error, result) => {
            if (error) {
                console.log(error);
            }
        })
        database.release();
    })

    return res.send("");
}

exports.addTask = (req, res) => {
    let task_name = req.body.task_name;
    let project_name = req.cookies.project;
    if (task_name == "") {
        return res.send({
            success: false,
            text: "Please input task name"
        })
    }

    pool.getConnection((err,database)=>{
        database.query("SELECT * FROM project WHERE project_name = ?", [project_name], (error, result) => {
            task = result[0].task;
            if (task == null) {
                task_name = [task_name];
                res.cookie("alltasks", task_name);
                task_name = JSON.stringify(task_name);
                database.query("UPDATE project SET ? Where project_name = " + "'" + project_name + "'", { task: task_name }, (error, result) => {
                    if (error) {
                        console.log(error);
                    }

                    return res.send({
                        success: true,
                        text: "Task has successfully update"
                    })
                })
            }
            else {
                task = JSON.parse(result[0].task);
                for (var i = 0; i < task.length; i++) {
                    if (task[i] == task_name) {
                        return res.send({
                            success: false,
                            text: "This name has already used in this project"
                        })
                    }
                }
                task.push(task_name);
                task_name = task;
                res.cookie("alltasks", task_name);
                task_name = JSON.stringify(task_name);
                database.query("UPDATE project SET ? Where project_name = " + "'" + project_name + "'", { task: task_name }, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    return res.send({
                        success: true,
                        text: "Task has successfully update"
                    })
                })
            }
        })
        database.release();
    })
}


exports.enter_Actual_Time = (req, res) => {
    if (!req.body.start_time || !req.body.end_time) {
        return res.send({
            fail: true,
            text: "Please make sure appropriate time is filled in!"
        })
    }
    //project as a dummy
    username = req.cookies.username;
    project = req.cookies.project;
    task = req.cookies.task;
    if (task == ""){
        return res.send({
            fail: true,
            text: "Please create new task or click on the task that you have just created"
        })
    }
    // Data acquired from the form
    let { start_time, end_time } = req.body;
    // change start time and end time to date format
    date1 = new Date(start_time);
    date2 = new Date(end_time);
    // calculate range difference
    const diffTime = (date2 - date1);
    // validate time difference
    if (diffTime < 0) {
        return res.send({
            fail: true,
            text: "Please make sure appropriate time is filled in!"
        })
    }
    // change to hours (not sure why toFixed make it to string)
    var diffHours = (diffTime / (1000 * 60 * 60)).toFixed(2);
    diffHours = Number(diffHours);
    // able to see the project time
    pool.getConnection((err,database)=>{
        database.query("SELECT * FROM project WHERE project_name = ?", [project], async (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                var project_time = result[0].actual_time;
                project_time = JSON.parse(project_time);
                // nothing in the project
                if (project_time == null) {
                    time = {};
                    user_time = {};
                    user_time[username] = diffHours;
                    time[task] = user_time;
                    time = JSON.stringify(time);
                    database.query("UPDATE project SET ? Where project_name = " + "'" + project + "'", { actual_time: time }, (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                    })
                }
                else {
                    if (task in project_time) {
                        // user is inside
                        if (username in project_time[task]) {
                            var time = project_time[task];
                            user_time = time[username];
                            user_time = user_time + diffHours;
                            time[username] = user_time
                            project_time[task] = time
                            project_time = JSON.stringify(project_time)
                            database.query("UPDATE project SET ? Where project_name = " + "'" + project + "'", { actual_time: project_time }, (error, result) => {
                                if (error) {
                                    console.log(error);
                                }
                            })
                        }
                        // user in not inside
                        else {
                            var time = project_time[task];
                            time[username] = diffHours;
                            project_time[task] = time
                            project_time = JSON.stringify(project_time)
                            database.query("UPDATE project SET ? Where project_name = " + "'" + project + "'", { actual_time: project_time }, (error, result) => {
                                if (error) {
                                    console.log(error);
                                }
                            })
                        }
                    }
                    // no task inside the project
                    else {
                        user_time = {};
                        user_time[username] = diffHours;
                        project_time[task] = user_time;
                        project_time = JSON.stringify(project_time);
                        database.query("UPDATE project SET ? Where project_name = " + "'" + project + "'", { actual_time: project_time }, (error, result) => {
                            if (error) {
                                console.log(error);
                            }
                        })
                    }
                }
            }
        })
        database.release();
    })
    return res.send({
        success: true,
        text: "Time has succesfully updated!"
    })
}


exports.change_Task = (req, res) => {
    let tasks = req.cookies.alltasks;
    res.cookie("task", tasks[req.body.index])
    return res.send({
        success: true
    })
}


exports.add_Expected = (req, res) => {
    if (req.body.expected_time == "") {
        return res.send({
            success: false,
            text: "Please make sure the field are filled in"
        })
    }
    let project = req.cookies.project;
    let task = req.cookies.task;
    let username = req.cookies.username;
    if (task == ""){
        return res.send({
            success: false,
            text: "Please create new task or click on the task that you have just created"
        })
    }
    let expected_time = req.body.expected_time;
    expected_time = Number(expected_time);
    if (expected_time <= 0){
        return res.send({
            success: false,
            text: "Please input valid number"
        })
    }
    pool.getConnection((err,database)=>{
        database.query("SELECT * FROM project WHERE project_name = ?", [project], async (error, result) => {
            let database_expected_time = (result[0].expected_time);
            database_expected_time = JSON.parse(database_expected_time);
            // nothing in the expected time
            if (database_expected_time == null) {
                expected_time_input = {};
                user_time = {};
                user_time[username] = expected_time;
                expected_time_input[task] = user_time;
                expected_time_input = JSON.stringify(expected_time_input);
                database.query("UPDATE project SET ? Where project_name = " + "'" + project + "'", { expected_time: expected_time_input }, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    return res.send({
                        success: true,
                        text: "Expected time input succesful"
                    })
                })
            }
            else {
                // task is inside expected_time
                if (task in database_expected_time) {
                    // user is inside the task
                    if (username in database_expected_time[task]) {
                        var each_time = database_expected_time[task]; // object of each time
                        user_time = each_time[username]; // find the user time
                        user_time = user_time + expected_time; // add in the expected time
                        each_time[username] = user_time // put back the time
                        database_expected_time[task] = each_time // put back all the time task
                        database_expected_time = JSON.stringify(database_expected_time)
                        database.query("UPDATE project SET ? Where project_name = " + "'" + project + "'", { expected_time: database_expected_time }, (error, result) => {
                            if (error) {
                                console.log(error);
                            }
                            return res.send({
                                success: true,
                                text: "Expected time input succesful"
                            })
                        })
                    }
                    // user is not inside task
                    else {
                        var each_time = database_expected_time[task];
                        each_time[username] = expected_time;
                        database_expected_time[task] = each_time
                        database_expected_time = JSON.stringify(database_expected_time)
                        database.query("UPDATE project SET ? Where project_name = " + "'" + project + "'", { expected_time: database_expected_time }, (error, result) => {
                            if (error) {
                                console.log(error);
                            }
                            return res.send({
                                success: true,
                                text: "Expected time input succesful"
                            })
                        })
                    }
                }
                // task is not inside
                else {
                    each_time = {};
                    each_time[username] = expected_time;
                    database_expected_time[task] = each_time;
                    database_expected_time = JSON.stringify(database_expected_time);
                    database.query("UPDATE project SET ? Where project_name = " + "'" + project + "'", { expected_time: database_expected_time }, (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                        return res.send({
                            success: true,
                            text: "Expected time input succesful"
                        })
                    })
                }
            }
        })
        database.release();
    })
}

exports.draw_Chart = (req, res) => {
    let project = req.cookies.project
    let task = req.cookies.task

    pool.getConnection((err,database)=>{
        database.query("SELECT * FROM project WHERE project_name = ?", [project], async (error, result) => {
            all_task_time_expected = result[0].expected_time;
            all_task_time_actual = result[0].actual_time;
            all_task_time_expected = JSON.parse(all_task_time_expected);
            all_task_time_actual = JSON.parse(all_task_time_actual);
            // changing according to the user input
            if (all_task_time_actual == null && all_task_time_expected == null){
                task_expected_time = [];
                task_actual_time = [];
            }
            else if(all_task_time_actual == null){
                task_expected_time = all_task_time_expected[task];
                task_actual_time = [];
            }
            else if(all_task_time_expected == null){
                task_expected_time = [];
                task_actual_time = all_task_time_actual[task];
            }
            else{
                task_expected_time = all_task_time_expected[task];
                task_actual_time = all_task_time_actual[task];
            }

            if (task_actual_time == null && task_expected_time == null){
                task_expected_time = [];
                task_actual_time = [];
            }
            else if(task_actual_time == null){
                task_actual_time = [];
            }
            else if(task_expected_time == null){
                task_expected_time = [];
            }

            combine_time = [task_expected_time,task_actual_time,task];
            res.send(combine_time);
        })
        database.release();
    })
}

exports.addComment = (req, res) => {
    let comment_context = req.body.comment_context;
    let username = req.cookies.username;
    let project = req.cookies.project;

    if (comment_context == "") {
        return res.send({
            success: false,
            text: "Please make sure that the text area is filled in!"
        })
    }

    pool.getConnection((err,database)=>{
    // able to see the project comment 
        database.query("SELECT * FROM project WHERE project_name = ?", [project], async (error, result) => {
            if (error) {
                console.log(error);
            }

            // let account = [];

            // database.query("SELECT * FROM users WHERE username = ?", [username], (error2, result2) => {
            //     if (result2.length > 0) {
            //         for (let i = 0; i < result2.length; i++) {
            //             account.push(result2[i]);
            //         }
            //         if (error) {
            //             return res.render('student_allocation', {
            //                 prompt: "Error!",
            //                 account: account
            //             })
            //         } else {
            //             return res.render('student_allocation', {
            //                 success: "Successfully deleted",
            //                 account: account
            //             })
            //         }
            //     }
            // })

            comment = result[0].comment;
            if (comment == null) {
                comment_context = [comment_context];
                res.cookie("allcomments", comment_context);
                comment_context = JSON.stringify(comment_context);
                database.query("UPDATE project SET ? where project_name = " + "'" + project + "'", { comment: comment_context }, (error, result) => {
                    if (error) {
                        console.log(error);
                    }

                    return res.send({
                        success: true,
                        text: "Comment has been successfully updated"
                    })
                })
            } else {
                comment = JSON.parse(result[0].comment);
                comment.push(comment_context);
                comment_context = comment;
                res.cookie("allcomments", comment_context);
                comment_context = JSON.stringify(comment_context);
                database.query("UPDATE project SET ? WHERE project_name = " + "'" + project + "'", { comment: comment_context }, (error, result) => {
                    if (error) {
                        console.log(error);
                    }

                    return res.send({
                        success: true,
                        text: "Comment has been successfully updated!"
                    })
                    

                })
           }
        })

        database.release();

    })

}
