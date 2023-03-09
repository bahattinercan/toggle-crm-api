const express = require("express");
const router = express.Router();
const apiKey = require('../apiKey');
'use strict';
var TogglClient = require('toggl-api'), toggl = new TogglClient({ apiToken: apiKey });

router.get("/:wid", (req, res, next) => {
    var result = [];
    wid = req.params.wid;
    toggl.getWorkspaceUsers(wid, true, (err, users) => {
        result = users;
        result.pop();
        res.status(200).json(result);
        return;
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            result[i] = user;
        }
        result.pop();
        res.status(200).json(result);
    });
});

module.exports = router;