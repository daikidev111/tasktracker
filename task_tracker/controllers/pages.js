const db = require("../connect");
const { project } = require("./auth");

const pool = db();

exports.create_project = (req,res)=>{
    pool.getConnection((err,database)=>{
        if (req.session.userdata.permission == "student"){
            database.query("SELECT * FROM student_project WHERE username = ?", [req.session.userdata.username], (err ,result)=>{
                let project_name = result[0].project_name;
                database.query("SELECT * FROM project WHERE project_name = ?",[project_name], (err, result)=>{
                    if (result.length>0){
                        let project = [];
                        for (let i = 0; i< result.length; i++){
                            project.push(result[i]);
                        }
                        res.render("create_project",{
                            project: project
                        });
                    } else {
                        res.render("create_project");
                    }
                })
            })
            
        } else {
            database.query("SELECT * FROM project", (err, result)=>{
                if (result.length>0){
                    let project = [];
                    for (let i = 0; i< result.length; i++){
                        project.push(result[i]);
                    }
                    res.render("create_project",{
                        project: project,
                        permission: true
                    });
                } else {
                    res.render("create_project",{
                        permission: true
                    });
                }
            })
        }
        database.release();
    })
}

exports.load_studentAllo = (req,res)=>{
    let project_name = req.session.projectdata.project_name;

    pool.getConnection((err,database)=>{
        database.query("SELECT * FROM project WHERE project_name = ?", [project_name], async (error, result) => {
            if (error) {
                console.log(error);
            } else {
                req.session.projectdata = result[0];
            }
        })
        database.query("SELECT * FROM student_project ", async (error, result) => {
            let project_name = req.session.projectdata.project_name
            let unallocated_students = [];
            let allocated_students = [];
            let project_task = [];
            let project_comment = [];


            database.query("SELECT * FROM project WHERE project_name = ?", [project_name], (error, result2) => {
                task = JSON.parse(result2[0].task)
                if (task == null){
                    project_task = []
                }
                else{
                    for (let i = 0; i < task.length; i++){
                        project_task.push(task[i]);
                    }
                }

                            
                comment = JSON.parse(result2[0].comment);
                if (comment == null){
                    project_comment = [];
                } else {
                    for (let i = 0; i < comment.length; i++){
                        project_comment.push(comment[i]);
                    }
                }
            })

            database.query("SELECT * FROM users WHERE permission = ?", ['student'], (error,result3)=>{
                for (let i = 0 ; i< result.length ; i++){
                    for (let y = 0; y< result3.length ; y++){
                        if (result[i].username == result3[y].username && result[i].project_name == ""){
                            unallocated_students.push(result[i].username);
                        }
                    }
                    if (result[i].project_name == project_name){
                        allocated_students.push(result[i].username)
                    }
                }   

                if (req.session.userdata.permission == "student"){
                    res.render("student_allocation", {
                        data: req.session.projectdata, 
                        unallocated_students: unallocated_students,
                        allocated_students: allocated_students,
                        task:project_task,
                        isStudent: true,
                        comment: project_comment
                    });
                } else if (req.session.userdata.permission == "admin") {
                    res.render("student_allocation", {
                        data: req.session.projectdata, 
                        unallocated_students: unallocated_students,
                        allocated_students: allocated_students,
                        task:project_task,
                        permission: true,
                        isStudent: true,
                        comment: project_comment
                    });
                } else {
                    res.render("student_allocation", {
                        data: req.session.projectdata, 
                        unallocated_students: unallocated_students,
                        allocated_students: allocated_students,
                        task:project_task,
                        permission: true,
                        comment: project_comment
                    });
                }
            })
        })
        database.release();
    })
}


exports.delete_account = (req,res)=>{
    pool.getConnection((err,database)=>{
        database.query("SELECT * FROM users", (req,result)=>{
            if (result.length>0){
                let account = [];
                for (let i = 0; i< result.length; i++){
                    account.push(result[i]);
                }
                res.render("delete_account",{
                    account: account
                });
            } else {
                res.render("delete_account");
            }

        })
        database.release();
    })
}
