//brcyptjs
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);


module.exports = function(app, Random, send){

    app.get("/register", function(req, res){
         res.render("register");
    });

    app.post("/register", function(req, res){
        
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                if(err){
                    res.render("register", {errMsg: "Lỗi mã hóa " + err});
                }else{
                    
                    var random = Random(10);
                    
                    // Save User
                }
            });
        });

    });

    app.get("/login", function(req, res){
        res.render("login");
    });

}

