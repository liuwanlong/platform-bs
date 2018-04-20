var express = require('express');
var router = express.Router();
var db = require('../conn/db');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/getProjects', function (req, res, next) {
    var id = req.params.id;
    db.query("select * from projects", function (err, rows) {
        if (err) {
            console.log(err)
        } else {
            res.send({
                code: 1,
                msg: rows
            })
        }
    })
})

router.get('/getProject/:id', function (req, res, next) {
    var id = req.params.id;
    db.query("select * from projects where id=" + id + "", function (err, rows) {
        if (err) {
            console.log(err)
        } else {
            console.log(rows);
            res.send({
                code: 1,
                msg: rows[0].store
            })
        }
    })
})

/* POST */
router.post('/del', function (req, res, next) {
    var id = req.body.id;
    db.query("delete from projects where id = " + id, function (err, rows) {
        if (err) {
            console.log(err)
        } else {
            res.send({
                code: 1,
                msg: 'success'
            })
        }
    })
})
router.post('/set', function (req, res, next) {
    var store = req.body.store, id = req.body.id;
    store.forEach(function (s) {
        if (!s.children) {
            s.children = [];
        }
    })
    db.query("update projects set store = '" + JSON.stringify(store) + "' where id = " + id, function (err, rows) {
        if (err) {
            console.log(err)
        } else {
            res.send({
                code: 1,
                msg: 'success'
            })
        }
    })
})

router.post('/new', function (req, res, next) {
    var project = req.body.store;
    project[0].children = [];
    db.query("insert into projects(id,store) values(null,'" + JSON.stringify(project) + "')", function (err, rows) {
        if (err) {
            res.send({
                code: 0,
                msg: err
            })
        } else {
            db.query("select * from projects", function (err, rows) {
                if (err) {
                    console.log(err)
                } else {
                    res.send({
                        code: 1,
                        msg: rows[rows.length-1].id
                    })
                }
            })
        }
    })
})

module.exports = router;
