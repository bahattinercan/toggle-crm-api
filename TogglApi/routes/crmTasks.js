const express = require("express");
const router = express.Router();
const sqlbaglan = require("../sqlbaglantisi");
'use strict';
var TogglClient = require('toggl-api');

router.get("/start-time-entry/:taskid", (req, res, next) => {
    taskid = "" + req.params.taskid;
    const mysql = require("mysql");

    var con = mysql.createConnection({
        host: sqlbaglan.Host,
        user: sqlbaglan.User,
        password: sqlbaglan.Password,
        database: sqlbaglan.Database
    });
    con.connect(function (err) {
        // task_id ile bu işe atanan personelin verilerini alıyoruz 
        con.query("SELECT staffid FROM tbltask_assigned Where taskid='" + taskid + "'", function (err, result, fields) {
            staffid = result[0]["staffid"];
            // staffid ile staff'ın(personel) verilerini alıp apikey'i çekiyoruz   
            con.query("SELECT * FROM tblstaff Where staffid='" + staffid + "'", function (err, result, fields) {
                apikey = result[0]["toggl_api_key"];
                // task id ile task verilerini alıyoruz
                con.query("SELECT name FROM tbltasks Where id='" + taskid + "'", function (err, result, fields) {
                    task = result[0];
                    description = taskid + "-" + task["name"];

                    // time entry başlatır
                    toggl = new TogglClient({ apiToken: apikey });
                    toggl.startTimeEntry({
                        description: description,
                        billable: true
                    }, function (err, timeEntry) {
                        res.status(200).json({
                            id: timeEntry["id"]
                        });
                        con.end();
                    });
                });

            });
        });
    });

});

router.get("/stop-time-entry/:taskid/:lastTaskId", (req, res, next) => {
    taskid = "" + req.params.taskid;
    const mysql = require("mysql");

    var con = mysql.createConnection({
        host: sqlbaglan.Host,
        user: sqlbaglan.User,
        password: sqlbaglan.Password,
        database: sqlbaglan.Database
    });
    con.connect(function (err) {
        // task_id ile bu işe atanan personelin verilerini alıyoruz 
        con.query("SELECT staffid FROM tbltask_assigned Where taskid='" + taskid + "'", function (err, result, fields) {
            staffid = result[0]["staffid"];
            // staffid ile staff'ın(personel) verilerini alıp apikey'i çekiyoruz   
            con.query("SELECT * FROM tblstaff Where staffid='" + staffid + "'", function (err, result, fields) {
                apikey = result[0]["toggl_api_key"];
                lastTaskId = req.params.lastTaskId;
                // time entry başlatır
                toggl = new TogglClient({ apiToken: apikey });
                toggl.stopTimeEntry(lastTaskId, function (err) {
                    toggl.updateTimeEntry(lastTaskId, { tags: ['finished'] }, function (err) {
                        res.status(200).json({ islem: " başarılı" });
                        con.end();
                        toggl.destroy();
                        
                    })
                });
            });
        });
    });

});

router.get("/:id", (req, res, next) => {
    id = "" + req.params.id;
    const mysql = require("mysql");

    var con = mysql.createConnection({
        host: sqlbaglan.Host,
        user: sqlbaglan.User,
        password: sqlbaglan.Password,
        database: sqlbaglan.Database
    });

    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT name FROM tbltasks Where id='" + id + "'", function (err, result, fields) {
            if (err) throw err;

            res.status(200).json(result[0]);
            con.end(function (err) {
                if (err) throw err;
            });
        });
    });

});



module.exports = router;