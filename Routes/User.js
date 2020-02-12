//brcyptjs
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

//JWT
var jwt = require('jsonwebtoken');
const secret = "Hl))@@Wo@lele???";

//Models
var User = require("../Models/User");
var Token = require("../Models/Token");
var MessageChat = require("../Models/MessageChat");

var fs = require("fs");

module.exports = function(app, Random, send){
    app.post('/getMessageChats',(req,res)=>{
        var idBoss=req.body.idBoss
        var idSen=req.body.idSen
        var token=req.body.BossToken
        Token.findOne({Token:token, Active:true}, function(err, item){
            if(err || !item){
                res.json({
                    kq:0,
                    errMsg:"Token không còn hiệu lực"
                })
            }else{
                jwt.verify(item.Token, secret, function(err, decoded) {
                    if(err){
                        res.json({
                            kq:0,
                            errMsg:"Token không còn hiệu lực"
                        })
                    }else{
                        MessageChat.find({$or:[{Boss:idBoss,Sen:idSen},{Boss:idSen,Sen:idBoss}]},null,{sort:{Time:-1}},function(err,item){
                            if(err){
                                res.json({
                                    kq:0,
                                    errMsg:"Lỗi Mongoose"
                                })
                            }else{
                                res.json(item)

                            }

                        })
                    }
                });  
            }
        });
        })
    app.get("/", function(req, res){
        if(!req.cookies.ChatAppToken){
            console.log("Bạn chưa login");
            res.redirect("./login");
        }else{
            Token.findOne({Token:req.cookies.ChatAppToken, Active:true}, function(err, item){
                if(err || !item){
                    console.log("Không tìm thấy Token");
                    res.redirect("./login");
                }else{
                    jwt.verify(item.Token, secret, function(err, decoded) {
                        if(err){
                            console.log("Token sai!");
                            res.redirect("./login");
                        }else{
                            //console.log(decoded);
                            res.render("home", {user:decoded});
                        }
                    });  
                }
            });
        }
    });

    app.post("/verifyToken", function(req, res){
        if(!req.body.ChatAppToken){
            res.json({kq:0, errMsg:"Bạn chưa login"});
        }else{
            Token.findOne({Token:req.body.ChatAppToken, Active:true}, function(err, item){
                if(err || !item){
                    res.json({kq:0, errMsg:"Không tìm thấy Token"});
                }else{
                    jwt.verify(item.Token, secret, function(err, decoded) {
                        if(err){
                            res.json({kq:0, errMsg:"Token sai"});
                        }else{
                            res.json({kq:1});
                        }
                    });  
                }
            });
        }
    });

    app.get("/login", function(req, res){
        res.render("login", {errMsg:""});
        flag = "";
    });

    app.post("/login", function(req, res){
        User.findOne({Username:req.body.Username, Active:true}, function(err, item){
            if(err || !item){
                res.json({kq:0, errMsg:"Không tìm thấy Username"});
            }else{
                bcrypt.compare(req.body.Password, item.Password, function(err, resB) {
                    if(err || resB === false){
                        res.json({kq:0, errMsg:"Sai Password!"});
                    }else{
                        jwt.sign({
                            exp: Math.floor(Date.now() / 1000) + (60 * 60),
                            data: item
                        }, secret, function(err, token){
                            if(err){
                                res.json({kq:0, errMsg:"Lỗi tạo Token!"});
                            }else{
                                var newToken = new Token({
                                    Token:token,
                                    Active: true
                                });
                                newToken.save(function(err){
                                    if(err){
                                        res.json({kq:0, errMsg:"Save Token lỗi!"});
                                    }else{
                                        res.json({kq:1, token:token});
                                    }
                                });
                            }
                        });

                    }
                });
            }
        });
    });

    app.get("/register", function(req, res){
         res.render("register");
    });

    app.post("/register", function(req, res){

        // khong duoc trung email / username
        User.findOne( { $or:[{Username:req.body.username}, {Email:req.body.email}] }, function(err, item){
            if(err || item ){
                res.render("register", {errMsg: "Username or Email is not availble!"});
            }else{
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        if(err){
                            res.render("register", {errMsg: "Lỗi mã hóa " + err});
                        }else{
                            
                            var random = Random(10);
                            
                            // Save User
                            var newUser = new User({
                                Username: req.body.username,
                                Email: req.body.email,
                                Password: hash,
                                Avatar: "user.png",
                                Active: false,
                                RandomActive: random,
                                Group: 0
                            });
                            
                            newUser.save(function(err){
                                if(err){
                                    res.render("register", {errMsg: "Mongo save user error!"});
                                }else{

                                    fs.readFile("./views/active.html", "utf8", function(err, data){
                                        if(err){
                                            res.render("register", {errMsg: "Read file error!"});
                                        }else{
                                            data = data.replace("XXX", random);
                                            //gui mail active
                                            send({
                                                to:   req.body.email,
                                                subject: 'ChatRoom - User activation.',
                                                html: data  
                                            }, (error, result, fullResult) => {
                                                if (error){ 
                                                    res.render("register", {errMsg: "Mail error!"});
                                                }else{ 
                                                    res.render("register", {errMsg: "Congratulation, please check your email."});
                                                }
                                            });
                                        }
                                    });
                                    
                                    
                                }
                            });
                            
        
                        }
                    });
                });
            }
        });

    });

    

    app.get("/active/:random", function(req, res){
        User.findOne({RandomActive:req.params.random}, function(err, item){
            if(err || !item){
                res.render("active", {errMsg:"Please check your active link"});
            }else{

                if(item.Active){
                    res.render("active", {errMsg:"You have activated already!"});
                }else{
                    User.findOneAndUpdate({RandomActive:req.params.random}, {Active:true}, function(err){
                        if(err){
                            res.render("active", {errMsg:"Active failed!"});
                        }else{
                            res.render("active", {errMsg:"Activated successfully"});
                        }
                    });
                }

            }
        });
    });

    app.post("/messageChat", function(req, res){
        var msg = new MessageChat({
            Boss        :   req.body.ID_BOSS,
            Message     :   req.body.MESSAGE,
            Sen         :   req.body.ID_SEN,
            View        :   false,
            Time        :   Date.now()
        });
        msg.save(function(err){
            if(err){
                res.json({kq:0, errMsg:"Save Message error!"});
            }else{
                res.json({kq:1});
                //gửi tới người nhận
                req.app.io.to(req.body.SOCKET_ID_SEND).emit('sen-chat', {key:req.body.MESSAGE});
                //gửi tới boss để bên boss thấy
                req.app.io.to(req.body.SOCKET_ID_BOSS).emit('boss-chat', {key:req.body.MESSAGE});

            }
        });
    });

}

