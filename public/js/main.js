$(document).ready(function(){
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