const express = require("express");
const router = express.Router();
const apiKey = require('../apiKey');
'use strict';
var TogglClient = require('toggl-api'), toggl = new TogglClient({ apiToken: apiKey });
var dateFormat = require("dateformat");
var now = new Date();

function tarihDuzenle(s) {
    gun = s.slice(0, 2);
    ay = s.slice(3, 5);
    yil = s.slice(6, s.length);
    return yil + "-" + ay + "-" + gun;
}
function saniyeyeCevir(duration) {
    return String(Math.floor(Number(duration) / 1000));
}

router.get("/:islem/:tarih1/:tarih2/:wid", (req, res, next) => {
    islem = "" + req.params.islem;
    baslangic = "";
    bitis = dateFormat(now, "isoDateTime");
    var result = [];
    var userIds = "";
    switch (islem) {
        case "0":
            var zaman = dateFormat(now, "isoDateTime").slice(0, 11);
            var startT = zaman + "00:00:00+00:00";
            baslangic = startT;
            break;
        case "1":
            var startT = new Date();
            startT.setDate(startT.getDate() - 6);
            startT = dateFormat(startT, "isoDateTime").slice(0, 11) + "00:00:00+00:00";
            baslangic = startT;
            break;
        case "2":
            var baslangicT = tarihDuzenle(req.params.tarih1) + "00:00:00+00:00";
            var bitisT = tarihDuzenle(req.params.tarih2) + "23:00:00+00:00";
            baslangic = baslangicT;
            bitis = bitisT;
            break;
    }

    // userlerin id'leri çekilir
    toggl.getWorkspaceUsers(req.params.wid, true, (err, users) => {
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            userIds = userIds.concat(user["wid"] + ",");
        }
    });
    toggl.detailedReport(
        {
            user_agent: "deneme",
            workspace_id: req.params.wid,
            since: baslangic,
            until: bitis,
            billable: "no",
            user_ids: userIds,
            distinct_rates: "on",
            per_page: "150"
        }, (err, report) => {
            result = report;
            res.status(200).json(result);
        }
    );
});

// Genel datayı çekme , çift veriler temizlenmiş 
router.get("/:islem/:tarih1/:tarih2/:wid/data", (req, res, next) => {
    islem = "" + req.params.islem;
    wid = req.params.wid;
    baslangic = "";
    bitis = dateFormat(now, "isoDateTime");
    var result = [];
    var userIds = "";
    switch (islem) {
        case "0":
            var zaman = dateFormat(now, "isoDateTime").slice(0, 11);
            var startT = zaman + "00:00:00+00:00";
            baslangic = startT;
            break;
        case "1":
            var startT = new Date();
            startT.setDate(startT.getDate() - 6);
            startT = dateFormat(startT, "isoDateTime").slice(0, 11) + "00:00:00+00:00";
            baslangic = startT;
            break;
        case "2":
            var baslangicT = tarihDuzenle(req.params.tarih1) + "00:00:00+00:00";
            var bitisT = tarihDuzenle(req.params.tarih2) + "23:00:00+00:00";
            baslangic = baslangicT;
            bitis = bitisT;
            break;
    }
    // userlerin id'leri çekilir
    toggl.getWorkspaceUsers(req.params.wid, true, (err, users) => {
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            userIds = userIds.concat(user["wid"] + ",");
        }
    });
    console.log(userIds);
    // detaylı raporun hazırlanması için veriler
    toggl.detailedReport(
        {
            user_agent: "deneme",
            workspace_id: wid,
            since: baslangic,
            until: bitis,
            billable: "no",
            user_ids: userIds,
            distinct_rates: "on"
        }, (err, report) => {
            result = report["data"];
            for (let i = 0; i < result.length; i++) {
                const element = result[i]["dur"];
                result[i]["dur"] = saniyeyeCevir(element);
            }
            islenmisVeriler = [];

            // Verileri dönerek aynı isimdeki verilerin zamanlarını topluyoruz ve islenmis verilerde çiftlenmemiş halini tutuyoruz
            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                if (islenmisVeriler.length == 0) {
                    islenmisVeriler.push(element);
                }

                else {
                    varmi = false;
                    for (let i = 0; i < islenmisVeriler.length; i++) {
                        const islenmisVeri = islenmisVeriler[i];
                        if (islenmisVeri["description"] == element["description"]) {
                            var gecici = islenmisVeri["dur"];
                            var gecici2 = element["dur"];
                            varmi = true;
                            islenmisVeriler[i]["dur"] = String(gecici + gecici2);
                            break;
                        }
                    }
                    if (!varmi) {
                        islenmisVeriler.push(element);
                    }
                }
            }
            res.status(200).json(islenmisVeriler);
        }
    );
});

// Genel datayı çekme, normal
router.get("/:islem/:tarih1/:tarih2/:wid/data-normal", (req, res, next) => {
    islem = "" + req.params.islem;
    wid = req.params.wid;
    baslangic = "";
    bitis = dateFormat(now, "isoDateTime");
    var result = [];
    var userIds = "";
    switch (islem) {
        case "0":
            var zaman = dateFormat(now, "isoDateTime").slice(0, 11);
            var startT = zaman + "00:00:00+00:00";
            baslangic = startT;
            break;
        case "1":
            var startT = new Date();
            startT.setDate(startT.getDate() - 6);
            startT = dateFormat(startT, "isoDateTime").slice(0, 11) + "00:00:00+00:00";
            baslangic = startT;
            break;
        case "2":
            var baslangicT = tarihDuzenle(req.params.tarih1) + "00:00:00+00:00";
            var bitisT = tarihDuzenle(req.params.tarih2) + "23:00:00+00:00";
            baslangic = baslangicT;
            bitis = bitisT;
            break;
    }
    // userlerin id'leri çekilir
    toggl.getWorkspaceUsers(req.params.wid, true, (err, users) => {
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            userIds = userIds.concat(user["wid"] + ",");
        }
    });
    console.log(userIds);
    // detaylı raporun hazırlanması için veriler
    toggl.detailedReport(
        {
            user_agent: "deneme",
            workspace_id: wid,
            since: baslangic,
            until: bitis,
            billable: "no",
            user_ids: userIds,
            distinct_rates: "on"
        }, (err, report) => {
            result = report["data"];
            for (let i = 0; i < result.length; i++) {
                const element = result[i]["dur"];
                result[i]["dur"] = saniyeyeCevir(element);
            }
            islenmisVeriler = [];
            result.forEach(element => {
                islenmisVeriler.push(element);
            });
            res.status(200).json(islenmisVeriler);
        }
    );
});

// Uid'ye göre dataları çekme islemi, çift veriler temizlenmiş 
router.get("/:islem/:tarih1/:tarih2/:wid/:uid", (req, res, next) => {
    islem = "" + req.params.islem;
    baslangic = "";
    bitis = dateFormat(now, "isoDateTime");
    var result = [];
    var uid = req.params.uid;
    switch (islem) {
        case "0":
            var zaman = dateFormat(now, "isoDateTime").slice(0, 11);
            var startT = zaman + "00:00:00+00:00";
            baslangic = startT;
            break;
        case "1":
            var startT = new Date();
            startT.setDate(startT.getDate() - 6);
            startT = dateFormat(startT, "isoDateTime").slice(0, 11) + "00:00:00+00:00";
            baslangic = startT;
            break;
        case "2":
            var baslangicT = tarihDuzenle(req.params.tarih1) + "00:00:00+00:00";
            var bitisT = tarihDuzenle(req.params.tarih2) + "23:00:00+00:00";
            baslangic = baslangicT;
            bitis = bitisT;
            break;
    }
    toggl.detailedReport(
        {
            user_agent: "deneme",
            workspace_id: req.params.wid,
            since: baslangic,
            until: bitis,
            billable: "no",
            user_ids: uid,
            distinct_rates: "on",
            per_page: "150"
        }, (err, report) => {
            result = report["data"];
            for (let i = 0; i < result.length; i++) {
                const element = result[i]["dur"];
                result[i]["dur"] = saniyeyeCevir(element);
            }
            islenmisVeriler = [];

            // Verileri dönerek aynı isimdeki verilerin zamanlarını topluyoruz ve islenmis verilerde çiftlenmemiş halini tutuyoruz
            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                if (islenmisVeriler.length == 0) {
                    islenmisVeriler.push(element);
                }

                else {
                    varmi = false;
                    for (let i = 0; i < islenmisVeriler.length; i++) {
                        const islenmisVeri = islenmisVeriler[i];
                        if (islenmisVeri["description"] == element["description"]) {
                            var gecici = Number(islenmisVeri["dur"]);
                            var gecici2 = Number(element["dur"]);
                            varmi = true;
                            islenmisVeriler[i]["dur"] = String(gecici + gecici2);
                            break;
                        }
                    }
                    if (!varmi) {
                        islenmisVeriler.push(element);
                    }
                }
            }
            res.status(200).json(islenmisVeriler);
        }
    );

});

// Uid'ye göre  dataları çekme islemi, normal
router.get("/:islem/:tarih1/:tarih2/:wid/:uid/normal", (req, res, next) => {
    islem = "" + req.params.islem;
    baslangic = "";
    bitis = dateFormat(now, "isoDateTime");
    var result = [];
    var uid = req.params.uid;
    switch (islem) {
        case "0":
            var zaman = dateFormat(now, "isoDateTime").slice(0, 11);
            var startT = zaman + "00:00:00+00:00";
            baslangic = startT;
            break;
        case "1":
            var startT = new Date();
            startT.setDate(startT.getDate() - 6);
            startT = dateFormat(startT, "isoDateTime").slice(0, 11) + "00:00:00+00:00";
            baslangic = startT;
            break;
        case "2":
            var baslangicT = tarihDuzenle(req.params.tarih1) + "00:00:00+00:00";
            var bitisT = tarihDuzenle(req.params.tarih2) + "23:00:00+00:00";
            baslangic = baslangicT;
            bitis = bitisT;
            break;
    }
    toggl.detailedReport(
        {
            user_agent: "deneme",
            workspace_id: req.params.wid,
            since: baslangic,
            until: bitis,
            billable: "no",
            user_ids: uid,
            distinct_rates: "on",
            per_page: "150"
        }, (err, report) => {
            result = report["data"];
            for (let i = 0; i < result.length; i++) {
                const element = result[i]["dur"];
                result[i]["dur"] = saniyeyeCevir(element);
            }
            islenmisVeriler = [];
            result.forEach(element => {
                islenmisVeriler.push(element);
            });
            res.status(200).json(islenmisVeriler);
        }
    );

});

// Uid'ye göre total duration çekme islemi 
router.get("/:islem/:tarih1/:tarih2/:wid/:uid/total-dur", (req, res, next) => {
    islem = "" + req.params.islem;
    baslangic = "";
    bitis = dateFormat(now, "isoDateTime");
    var result = [];
    var uid = req.params.uid;
    switch (islem) {
        case "0":
            var zaman = dateFormat(now, "isoDateTime").slice(0, 11);
            var startT = zaman + "00:00:00+00:00";
            baslangic = startT;
            break;
        case "1":
            var startT = new Date();
            startT.setDate(startT.getDate() - 6);
            startT = dateFormat(startT, "isoDateTime").slice(0, 11) + "00:00:00+00:00";
            baslangic = startT;
            break;
        case "2":
            var baslangicT = tarihDuzenle(req.params.tarih1) + "00:00:00+00:00";
            var bitisT = tarihDuzenle(req.params.tarih2) + "23:00:00+00:00";
            baslangic = baslangicT;
            bitis = bitisT;
            break;
    }
    toggl.detailedReport(
        {
            user_agent: "deneme",
            workspace_id: req.params.wid,
            since: baslangic,
            until: bitis,
            billable: "no",
            user_ids: uid,
            distinct_rates: "on",
            per_page: "150"
        }, (err, report) => {
            result = report["data"];
            for (let i = 0; i < result.length; i++) {
                const element = result[i]["dur"];
                result[i]["dur"] = saniyeyeCevir(element);
            }
            islenmisVeriler = 0;
            // Verileri dönerek aynı isimdeki verilerin zamanlarını topluyoruz ve islenmis verilerde çiftlenmemiş halini tutuyoruz
            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                islenmisVeriler += Number(element["dur"]);
            }
            res.status(200).json({ totalDur: islenmisVeriler });
        }
    );
});

module.exports = router;