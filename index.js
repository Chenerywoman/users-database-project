const express = require("express");
const mysql = require("mysql");
const path = require("path");
const hbs = require("hbs");
const { static } = require("express");
const e = require("express");
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

app.use(express.urlencoded({ extended: false }));
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

    db.query(sqlQuery, (error, results) => {
        res.render("allUsers", {
            users: results
        });
    });
});

app.get("/register", (req, res) => {
    res.render("register")
});

app.post("/register", (req, res) => {

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
            res.redirect("/error");
        } else {
            if (result.length > 0) {
                res.render("register", {
                    existingEmail: email
                });
            
            } else {

                db.query(sqlQueryInsert, user, (error, result) => {
                    if (error) {
                        console.log(error)
                        res.render("error", {
                            message: `unable to register user ${first_name} ${surname}`
                        });

                    } else {
                        res.render("register", {
                            firstNameRegistered: first_name,
                            surnameRegistered: surname
                        });
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
            console.log(error)
            res.render("update",{
                notFound: id
            })
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

    const sqlQueryEmailCheck = "SELECT * FROM users WHERE email = ?";

    const sqlQuery = 'UPDATE users SET first_name = ?, surname  = ?, email = ?, password = ? WHERE id = ?';

    const emailParam = [email];
    const user = [first_name, surname, email, password, id];

    db.query(sqlQueryEmailCheck, emailParam, (error, result) => {
        if (error) {
            console.log(error)
            res.redirect("/error");
        } else {
            if ((result.length > 0) && (result[0].id != id)) {
                res.render("update", {
                    existingEmail: email
                });

            } else {

                db.query(sqlQuery, user, (error, results) => {
                    if (error) {
                        console.log(error)
                        res.render("update", {
                            notUpdated: id,
                            firstName: first_name, 
                            surname: surname
                        })

                    } else {
                       
                        res.render("update", {
                            name: first_name,
                            secondname: surname
                        });
                    }
                })
            }
        }
    });

});

app.post("/delete/:id", (req, res) => {

    const id = req.params.id;
    const userName = req.body.userName;
    const sqlSelectQuery = 'SELECT * FROM users WHERE id = ?';
    const sqlDeleteQuery = 'DELETE FROM users WHERE id = ?';
    const user = [id];

    db.query(sqlSelectQuery, user, (error, results) => {

        if (error) {
            res.render("error", {
                message: `unable to find user ${userName} with id ${id} to delete.`
            });
        } else {

            if (results.length < 1) {
                res.render("delete", {
                    alreadyDeleted: true,
                    id: id,
                    userName: userName
                });
            } else {

                const fullName = `${results[0].first_name}  ${results[0].surname}`;

                db.query(sqlDeleteQuery, user, (error, results) => {
                    if (error) {
                        res.render("error", {
                            message: `unable to delete user ${fullName} with id: ${id}.`
                        })

                    } else {
                        res.render("delete", {
                            deletedUserId: id,
                            deletedName: fullName
                        });
                    }
                });
            }
        }

    });
});

app.get("/profile/:id", (req, res) => {

    const id = req.params.id;
    const sqlQuery = 'SELECT * FROM users WHERE id = ?';
    const user = [id];

    db.query(sqlQuery, user, (error, result) => {

        if (error) {
            console.log(error)
            res.redirect("error")

        } else {

            if (result.length < 1) {
                
                res.render("profile", {
                    profile: false,
                    id: id
                });

            } else {

                res.render("profile", {
                    profile: true,
                    firstName:result[0].first_name,
                    surname:result[0].surname,
                    email: result[0].email,
                    id: id
                });
            }
           
        }

    });
});

app.get("/newblog/:id", (req, res) => {

    const id = req.params.id;
    
    res.render("newblog", {
        id: id
    })
});


app.post("/newblog/:id", (req, res) => {
    const id = req.params.id;

    const title = req.body.title;
    const blog = req.body.blog;

    const today = new Date();
    const dd  = today.getDate();
    const mm = today.getMonth();
    const yyyy = today.getFullYear();
    const dateSQL = `${yyyy}-${mm}-${dd}`;

    const sqlQuery = "INSERT INTO blogs (userId, title, blog, date) VALUES (?, ?, ?, ?)";

    const values = [id, title, blog, dateSQL];

    db.query(sqlQuery, values, (error, result) => {

        if (error){
            console.log(error);
        } else {
            console.log(result);
            res.render("newblog", {
                submitted: true,
                title: title,
                insertId: result.insertId
            })
        }
    });
});

app.get("/allblogs/:id", (req, res) => {



    const id = req.params.id;
    res.render("allblogs")
})

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




