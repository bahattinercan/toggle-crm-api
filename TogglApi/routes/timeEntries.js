const express = require("express");
const router = express.Router();
const apiKey = require('../apiKey');
const sqlbaglan = require("../sqlbaglantisi");
'use strict';
var TogglClient = require('toggl-api');
var dateFormat = require("dateformat");
var now = new Date();

router.get("/", (req, res, next) => {
    toggl = new TogglClient({ apiToken: apiKey });
    var zaman = dateFormat(now, "isoDateTime");
    const kesilmisZaman = zaman.slice(0, 11);
    const endDate = kesilmisZaman + "23:59:59+00:00";
    const startDate = kesilmisZaman + "00:00:00+00:00";
    var result = [];
    toggl.getTimeEntries(startDate, endDate, (err, timeEntries) => {
        result = timeEntries;
        res.status(200).json(result);
    });
});

router.get("/start-time-entry/:apiKey/:description", (req, res, next) => {
    toggl = new TogglClient({ apiToken: req.params.apiKey });
    toggl.startTimeEntry({
        description: req.params.description,
        billable: true
    }, function (err, timeEntry) {
        res.status(200).json({
            id: timeEntry["id"]
        });
    });
});

router.get("/stop-time-entry/:apiKey/:id", (req, res, next) => {
    toggl = new TogglClient({ apiToken: req.params.apiKey });
    id = req.params.id;
    toggl.stopTimeEntry(id, function (err) {
        toggl.updateTimeEntry(id, { tags: ['finished'] }, function (err) {
            res.status(200).json({ islem: " başarılı" });
            toggl.destroy();
        })
    })
});

router.get("/stop-time-entry/:apiKey/:id", (req, res, next) => {
    toggl = new TogglClient({ apiToken: req.params.apiKey });
    id = req.params.id;
    toggl.stopTimeEntry(id, function (err) {
        toggl.updateTimeEntry(id, { tags: ['finished'] }, function (err) {
            res.status(200).json({ islem: " başarılı" });
            toggl.destroy();
        })
    })
});

module.exports = router;