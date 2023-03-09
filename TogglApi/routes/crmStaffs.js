const express = require("express");
const router = express.Router();
'use strict';
var TogglClient = require('toggl-api'), toggl = new TogglClient({ apiToken: apiKey });

router.get("/", (req, res, next) => {
    id = "" + req.params.id;
    const mysql = require("mysql");

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "crm"
    });

    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM tblstaff", function (err, result, fields) {
            if (err) throw err;
            res.status(200).json(result);
        });
    });
});

router.get("/get-fullname/:id", (req, res, next) => {
    id = "" + req.params.id;
    const mysql = require("mysql");

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "crm"
    });

    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT firstname,lastname FROM tblstaff Where staffid='" + id + "'", function (err, result, fields) {
            if (err) throw err;
            fullname = result[0]["firstname"] + " " + result[0]["lastname"];
            res.status(200).json({
                fullname: fullname
            });
        });
    });
});

router.get("/:id", (req, res, next) => {
    id = "" + req.params.id;
    const mysql = require("mysql");

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "crm"
    });

    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM tblstaff Where staffid='" + id + "'", function (err, result, fields) {
            if (err) throw err;
            res.status(200).json(result[0]);
        });
    });
});

module.exports = router;