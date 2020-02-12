var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

var server = require("http").Server(app);
var io = require("socket.io")(server);

app.io = io; // Matt chỉ

server.listen(3000);

//JWT
var jwt = require('jsonwebtoken');
const secret = "Hl))@@Wo@lele???";

var currentUsersOnline = [];

function User(socketid, _id, username, email, avatar, active, group ){
    this.SOCKETID = socketid;
    this._ID = _id;
    this.USERNAME = username;
    this.EMAIL = email;
    this.AVATAR = avatar;
    this.ACTIVE = active;
    this.GROUP = group;
}

io.on("connection", function(socket){
    console.log("new connecttion:"+socket.id );
    socket.emit("server-send-boss-socketid",{
        BossSocketID:socket.id
    })//khách hàng nào mà request lên thì server bắn socket của nó về ngay
    
    socket.on("client-send-token", function(data){
        // verify
        jwt.verify(data, secret, function(err, decoded) {
            if(err){
                console.log("Token sai!");
                socket.emit("server-send-authentication-result", {kq:0});
            }else{
                //console.log(decoded);
                currentUsersOnline.push( new User(socket.id, decoded.data._id, decoded.data.Username, decoded.data.Email, decoded.data.Avatar, decoded.data.Active, decoded.data.Group) );
                socket.emit("server-send-authentication-result", {
                    kq:1,
                    _id: decoded.data._id,
                    Username: decoded.data.Username,
                    Emai: decoded.data.Email,
                    Avatar: decoded.data.Avatar,
                    Active: decoded.data.Active,
                    Group: decoded.data.Group
                });

                io.sockets.emit("server-send-currentUsers", currentUsersOnline );
                
                console.log(currentUsersOnline);
            }
        });  
    });

    socket.on("disconnect", function(){
        currentUsersOnline.forEach(function(user, index){
            if( user.SOCKETID == socket.id ){
                currentUsersOnline.splice(index, 1);
                io.sockets.emit("server-send-currentUsers", currentUsersOnline );
            }
        });
    });

});


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb+srv://giaminh:Io2JiDLR9WgakY6N@cluster0-zjg82.gcp.mongodb.net/Mesenger?retryWrites=true&w=majority",  {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err){
        console.log("Error connect MongoDb: " + err);
    }else{
        console.log("Mongo connected successfully.");
    }
});

//Cookie-parser
var cookieParser = require('cookie-parser');
app.use(cookieParser());

//Gmail-Send
const send = require('gmail-send')({
    user: 'laptrinhnodejs2019@gmail.com',
    pass: '123456Abc'
});

require("./Routes/User")(app, RandomString,send );




function RandomString(n){
    var result = "";
    var arr = ["0","1","2","3","4","5","6","7","8","9","a", "b", "c", "d"];
    for(var i=1; i<=n; i=i+1 ){
        var r = Math.floor(Math.random() * arr.length); 
        result = result + arr[r];
    }
    return result;
}
