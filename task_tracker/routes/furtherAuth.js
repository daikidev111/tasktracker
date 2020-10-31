const db = require("../connect");
const database = db();


function authRoleTeacher_Admin(req, res, next){
        username = req.cookies.username;
        database.query("SELECT permission FROM users WHERE username = ?", [username], async (error, result) => {
            if (error) {
                console.log(error);
            } else if (result[0].permission == "student"){
                console.log("true")
                res.status(401).send({ error: "You are unauthorise to access this page" });
            }
            next()
        })
}

function authRoleAdmin(req, res, next){
        username = req.cookies.username;
        database.query("SELECT permission FROM users WHERE username = ?", [username], async (error, result) => {
            if (error) {
                console.log(error);
            } else if (result[0].permission == "teacher" || result[0].permission == "student"){
                console.log("true")
                res.status(401).send({ error: "You are unauthorise to access this page" });
            }
            next()
        })
}

function authAllRole(req, res, next){
    username = req.cookies.username;
    database.query("SELECT permission FROM users WHERE username = ?", [username], async (error, result) => {
        if (error) {
            console.log(error);
        } else if (result[0].permission != "teacher" || result[0].permission != "student" || result[0].permission != "admin"){
            console.log("true")
            res.status(401).send({ error: "You are unauthorise to access this page" });
        }
        next()
    })
}

module.exports = {
    authRoleTeacher_Admin,
    authRoleAdmin,
    authAllRole
}