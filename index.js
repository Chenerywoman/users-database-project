const express = require("express");
const mysql = require("mysql");
const path = require("path");
const hbs = require("hbs");
const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 8889,
    database: "my_users_db"
});

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("mysql connected");
    }
});

const viewsPath = path.join(__dirname, "/views");
const partialPath = path.join(__dirname, "views/inc");
const publicDirectory = path.join(__dirname, "/public");

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(publicDirectory));

app.set("view engine", "hbs");
app.set("views", viewsPath);

hbs.registerPartials(partialPath);

app.get("/", (req, res) => {
    res.render("index.hbs")
});

app.get("/allUsers", (req, res) => {
    const sqlQuery = 'SELECT * FROM users';

    db.query(sqlQuery,(error, results) =>{
        res.render("allUsers", {
            users:results
        });
    });
});

app.get("/register", (req, res) => {

    res.render("register")
});

app.post("/register", (req, res) => {

    console.log(`first name in register ${req.body.first_name}`)

    const first_name = req.body.first_name;
    const surname = req.body.surname;
    const email = req.body.email;
    const password = req.body.password;

    const sqlQueryEmailCheck = "SELECT * FROM users WHERE email = ?";
    const sqlQueryInsert = "INSERT INTO users (first_name, surname, email, password) VALUES (?, ?, ?, ?)";
    
    const emailParam = [email]
    const user = [first_name, surname, email, password];

    db.query(sqlQueryEmailCheck, emailParam, (error, result) => {
        if (error) {
            console.log(error)
        } else {
            if (result.length){

                res.render("error", {
                    message: `The ${email} already exists in the database.  Please register with a different email.`
                })

            } else {

                db.query(sqlQueryInsert, user, (error, result) => {
                    if (error) {

                        res.render("error", {
                            
                            message: `unable to register user ${first_name} ${surname}`
                        });

                    } else {

                        res.render("register", {
                            firstNameRegistered: first_name, 
                            surnameRegistered: surname
                        })
                    }
                });
            }
        }
    });

    
});

app.get("/update/:id", (req, res) => {

    const sqlQuery = 'SELECT * FROM users WHERE id = ?';
    const id = req.params.id
    const user = [id];

    db.query(sqlQuery, user, (error, results) => {
        if (error) {
            res.send(`User number ${id} not found` )
        } else {

            let userDetails = results[0];

            res.render("update", {
                first_name: userDetails.first_name,
                surname: userDetails.surname,
                email: userDetails.email,
                password: userDetails.password,
                id: id
            })
        }
    });

});

app.post("/update/:id", (req, res) => {

    const id = req.params.id;
    const first_name = req.body.first_name;
    const surname = req.body.surname;
    const email = req.body.email;
    const password = req.body.password;

    const sqlQuery = 'UPDATE users SET first_name = ?, surname  = ?, email = ?, password = ? WHERE id = ?';

    const user = [first_name, surname, email, password, id]

    db.query(sqlQuery, user, (error, results) => {
        if (error) {
            res.send("unable to update user")
        } else {
            res.render("update", {
                updatedName: first_name,
                updatedSurname: surname
            });
        }
    })
});

app.post("/delete/:id", (req, res) => {

    const id = req.params.id;
    const userName = req.body.userName;
    const sqlDeleteQuery = 'DELETE FROM users WHERE id = ?';
    const user = [id];

    db.query(sqlDeleteQuery, user, (error, results) => {
        if (error) {
            res.send(`unable to delete user ${id}`)
        } else {
            res.render("delete", {
                deletedUserId: id,
                userName: userName
            });
        }
    });
});

app.get("/error", (req, res) => {
    res.render("error")
});

app.get("*", (req, res) => {
    res.render("page-not-found", {
        page: req.url
    });
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000");
});




