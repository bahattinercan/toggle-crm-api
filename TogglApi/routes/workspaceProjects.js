const express = require("express");
const router = express.Router();
const apiKey = require('../apiKey');
'use strict';
var TogglClient = require('toggl-api'), toggl = new TogglClient({ apiToken: apiKey });


router.get("/:wid", (req, res, next) => {
    toggl.get
    var result = [];
    toggl.getWorkspaceProjects(req.params.wid,(err, projects) => {
        result = projects;
        res.status(200).json(result);
    });
});

module.exports = router;