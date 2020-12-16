const express = require("express");
const mysql = require("mysql");
const path = require("path");
const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root";
    password: "root";
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


app.get("*", (req, res) => {
    res.render("page-not-found", {
        page: req.url
    });
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000");
});




