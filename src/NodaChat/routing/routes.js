module.exports = function(app, io, dataAccess) {

    var db = new dataAccess();

    function authorize(nickname, password, callback) {
        console.log("Login attempt: " + nickname + ", " + password);
        db.findUser(nickname, function(err, data) {
            if (err) {
                callback(err);
            } else if (data.length === 0) {
                console.log("Register attempt: " + nickname + ", " + password);
                db.saveUser(nickname, password, function(err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log("User saved");
                        callback(null, data);
                    }
                });
            } else {
                callback(null, data);
            }
        });
    }

    app.get("/", function(req, res) {
        res.render("index");
    });

    app.post("/login", function(req, res, next) {

        var nickname = req.body.nickname,
            password = req.body.password;

        authorize(nickname, password, function(err, data) {
            if (err) {
                return next();
            }
            res.json(data);
        });
    });

    app.get("/db", function(req, res, next) {
        db.findAll(function(err, data) {
            if (err) {
                return next(err);
            } else {
                res.json(data);
            }
        });
    });
};