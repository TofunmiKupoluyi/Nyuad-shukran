var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DB || "taxis",
    charset: "utf8mb4"
});

console.log(connection);
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", express.static("./static"));
var mainRouter = express.Router();
app.use("/", mainRouter);


mainRouter.get("/", function(req, res){
    res.sendfile("./static/main.html");
});

mainRouter.post("/updateTaxi", function(req, res){
    var numberOfTaxis = req.body.numberOfTaxis;


    connection.query("INSERT INTO main SET number_of_taxis = ?", [numberOfTaxis], function(err, res1){
        var data = {
            err: 1,
            res: ""
        }
        if(err){
            data.res = err;
            res.sendfile("./static/badInput.html");
        }
        else{
            data.err = 0;
            data.res = "Successful";
            res.sendfile("./static/successful.html");
        }

    });

});

mainRouter.get("/numberOfTaxis", function(req, res){
    connection.query("SELECT number_of_taxis, timestamp FROM main ORDER BY id DESC LIMIT 1", function(err, res1){
        var data = {
            err: 1,
            res: "",
            number_of_taxis: "",
            date: ""
        }
        if(err){
            data.res = err;
            res.json(data);
        }
        else{
            data.err = 0;
            data.number_of_taxis = res1[0].number_of_taxis;
            data.res = "Successful";
            data.date = res1[0].timestamp;
            res.json(data);

        }

    });
});



app.listen(3000);