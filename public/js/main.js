$(document).ready(function(){

   $("#btnLogin").click(function(){
       $.post("http://localhost:3000/login", {
                Username:$("#username").val(), 
                Password:$("#password").val()
            }, 
            function(data){
                console.log(data);
                if(data.kq==1){
                    setCookie("ChatAppToken", data.token, 30);
                    window.location = "http://localhost:3000";
                }else{
                    alert(data.errMsg);
                }
            }
       );
   });

   $("#btnRegister").click(function(){
        var pw = $("#password").val();
        var re = $("#re-password").val();
        if( pw == re && pw.length > 5 ){
            return true;
        }  else {
            alert("Check password, please.");
            return false;
        } 
   });
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
  
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}