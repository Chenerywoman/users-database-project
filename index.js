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

    const sqlQuery = 'SELECT * FROM users';

    db.query(sqlQuery,(error, results) =>{
        res.render("index", {
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
                id: userDetails.id
            })
        }
    });

});

app.post("/update/:id", (req, res) => {

    console.log(req.body)
});

app.get("*", (req, res) => {
    res.render("page-not-found", {
        page: req.url
    });
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000");
});




