var socket = io("http://localhost:3000");
socket.on("server-send-boss-socketid", function(data){
    console.log("idbossmoi: "+data.BossSocketID)
    $("#BossSocketID").val(data.BossSocketID)
})

socket.on("server-send-authentication-result", function(data){
    console.log(data);
    $("#BossID").val(data._id);
    $("#K_username").html(data.Username);
    $("#K_email").val(data.Emai);
    $("#K_avatar").attr("src", "upload/" + data.Avatar  );
});

socket.on("server-send-currentUsers", function(data){
    console.log(data);
    $("#chat-list-tab").html("");
    data.forEach(function(user){
        if(user._ID != $("#BossID").val()){
            $("#chat-list-tab").append(`
            <a socketid="`+user.SOCKETID+`" iduser="`+user._ID+`" class="nav-link active userChat" id="chat-first-tab" data-toggle="pill" href="#chat-first" role="tab" aria-controls="chat-first" aria-selected="true">
                                        <div class="media active">
                                            <div class="user-status"></div>
                                            <img class="align-self-center rounded-circle" src="upload/`+ user.AVATAR +`" alt="User Image">
                                            <div class="media-body">
                                                <h5>`+ user.USERNAME +`<span class="chat-timing">02:30 pm</span></h5>
                                                <p>`+user.EMAIL+`</p>
                                            </div>
                                        </div>
                                    </a>
            `);
        }
    });
});


socket.on("sen-chat", function(data){
    $("#chat-first").append(`
    <div class="chat-message chat-message-left">
    <div class="chat-message-text">
        <span>`+data.key+`</span>
    </div>
    <div class="chat-message-meta">
        <span>4:20 pm<i class="feather icon-check ml-2"></i></span>
    </div>
</div>
    
    `
        
    )
});
socket.on("boss-chat", function(data){
    $("#chat-first").append(`
    <div class="chat-message chat-message-right">
    <div class="chat-message-text">
        <span>`+data.key+`</span>
    </div>
    <div class="chat-message-meta">
        <span>4:20 pm<i class="feather icon-check ml-2"></i></span>
    </div>
</div>
    
    `
        
    )
});

$(document).ready(function(){
    socket.emit("client-send-token", getCookie("ChatAppToken") );

    $(document).on("click", "a.userChat", function(){
        var socketid = $(this).attr("socketid");
        $("#SenSocketID").val(socketid);

        var senid = $(this).attr("iduser");
        $("#SenID").val(senid);
    });

    $("#button-addonsend").click(function(){
        var bossid = $("#BossID").val();
        var senid = $("#SenID").val();
        var sensocketid = $("#SenSocketID").val();
        var msg = $("#textMessageChat").val();
        var bosssocketid=$("#BossSocketID").val()
        $.post("http://localhost:3000/messageChat", 
        {
            ID_BOSS : bossid,
            ID_SEN  : senid, 
            SOCKET_ID_SEND: sensocketid,
            MESSAGE : msg,
            SOCKET_ID_BOSS:bosssocketid
        }
        , function(data){
            console.log(data);
        });
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