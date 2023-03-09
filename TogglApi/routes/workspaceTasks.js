const express = require("express");
const router = express.Router();
'use strict';
const apiKey = require('../apiKey');
'use strict';
var TogglClient = require('toggl-api'), toggl = new TogglClient({ apiToken: apiKey });


router.get("/:wid", (req, res, next) => {
    var result = [];
    toggl.getWorkspaceTasks(req.params.wid, true, (err, tasks) => {
        result = tasks;
        res.status(200).json(result);
    });
});

module.exports = router;