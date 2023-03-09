const express = require("express");
const router = express.Router();
const apiKey = require('../apiKey');
'use strict';
var TogglClient = require('toggl-api'), toggl = new TogglClient({ apiToken: apiKey });


router.get("/", (req, res, next) => {
    var result = [];
    toggl.getWorkspaces((err, workspaces) => {
        result = workspaces;
        res.status(200).json(result);
    });
});

module.exports = router;