var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var moment = require("moment");

var connection = mysql.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DB || "taxis",
    charset: "utf8mb4"
});

// ADDING ADD HOURS TO DATE OBJECT



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
            console.log(data);
            res.sendfile("./static/badInput.html");
        }
        else{
            data.err = 0;
            data.res = "Successful";
            console.log(data);
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
            
            data.date = new Date(res1[0].timestamp);
            data.date = new Date(data.date.setTime(data.date.getTime() + (4*60*60*1000)));
            res.json(data);

        }

    });
});

mainRouter.post("/postMessage", function(req, res){
    var recipient = req.body.recipient;
    var message = req.body.message;
    connection.query("INSERT INTO shokran SET recipient = ?, message= ?", [recipient, message], function(err, res1){
        var data = {
            err: 1,
            res: ""
        }
        if(err){
            data.res = err;
            console.log(data);
            res.sendfile("./static/badInput.html");
        }
        else{
            data.err = 0;
            data.res = "Successful";
            console.log(data);
            res.sendfile("./static/successful.html");
        }

    });

});

mainRouter.get("/getMessages", function(req, res){
    connection.query("SELECT id, recipient, message FROM shokran WHERE isPrinted = false ORDER BY id DESC LIMIT 1", function(err, res1){
        var data = {
            err: 1,
            res: "",
            message: "",
            recipient: "",
            valuesToPrint: false
        }
        if(err){
            data.res = err;
            res.json(data);
        }
        else{
            data.err = 0;
            if(res1[0]){
                data.recipient = res1[0].recipient;
                data.res = "Successful";
                data.message = res1[0].message;
                data.valuesToPrint = true;
                connection.query("UPDATE shokran  SET isPrinted = true WHERE id = ? ", [res1[0].id]);
            }
            
            
            res.json(data);
        }

    });
});



app.listen( process.env.PORT|| 3001);