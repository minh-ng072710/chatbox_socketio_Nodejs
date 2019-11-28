var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.listen(3000);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb+srv://khoapham:A9ymuVC3FbyIs034@cluster0-qah5q.mongodb.net/Chatbox?retryWrites=true&w=majority",  {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err){
        console.log("Error connect MongoDb: " + err);
    }else{
        console.log("Mongo connected successfully.");
    }
});

//Gmail-Send
const send = require('gmail-send')({
    user: 'laptrinhnodejs2019@gmail.com',
    pass: '123456Abc'
});
/* 
send({
            to:   'khoaphp@yahoo.com',
            subject: 'test subject',
            html:    'gmail-send <img src=""> example 1',  
          }, (error, result, fullResult) => {
            if (error){ res.send(error); }
            else{ res.send(result); }
        });
*/

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
