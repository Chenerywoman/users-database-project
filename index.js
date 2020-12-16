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

});

app.get("/allUsers", (req, res) => {
    const sqlQuery = 'SELECT * FROM users';

    db.query(sqlQuery,(error, results) =>{
        res.render("allUsers", {
            users:results
        });
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
  console.log(`id in delete ${req.params.id}`)
   console.log(`in delete ${req.body.userName}`)

    const id = req.params.id;
    const userName = req.body.userName;
    const sqlDeleteQuery = 'DELETE FROM users WHERE id = ?';
    const user = [id];

    db.query(sqlDeleteQuery, user, (error, results) => {
        if (error) {
            console.log(error)
            res.send(`unable to delete user ${id}`)
        } else {
            console.log(results);
            res.render("delete", {
                deletedUserId: id,
                userName: userName
            });
        }
    });
});

app.get("*", (req, res) => {
    res.render("page-not-found", {
        page: req.url
    });
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000");
});




