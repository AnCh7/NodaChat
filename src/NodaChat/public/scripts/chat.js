$(function () {
    
    var socket = io();
    var username;
    var connected = false;
    
    function addMessageElement(el, list) {
        var $el = $(el);
        list.append($el);
        list[0].scrollTop = list[0].scrollHeight;
    }
    
    function addChatMessage(data, isPrivate) {
        
        var avatarUrl = "../images/user.png";
        var $userAvatarImage = $("<img/>").addClass("media-object img-circle").attr("src", avatarUrl).css("max-height", "60px");
        var $userAvatar = $("<a href='#'/>").addClass("pull-left").append($userAvatarImage);
        
        var now = new Date();
        var message = data.from + " | " + now;
        var $msg = $("<small/>").addClass("text-muted").text(message);
        var $divMsg = $("<div/>").addClass("media-body").text(data.message).append("<br/>", $msg, "<hr/>");
        
        var $messageDiv = $("<div/>").addClass("media").append($userAvatar, $divMsg);
        var $mainLi = $("<li/>").addClass("media").append($messageDiv);
        
        if (isPrivate) {
            addMessageElement($mainLi, $("#privateChatMessages"));
        } else {
            addMessageElement($mainLi, $("#chatMessages"));
        }
    }
    
    function addUserToActiveUsers(data) {
        
        var avatarUrl = "../images/user.png";
        var $userAvatarImage = $("<img/>").addClass("media-object img-circle").attr("src", avatarUrl).css("max-height", "40px");;
        var $userAvatar = $("<a href='#'/>").addClass("pull-left").append($userAvatarImage);
        
        var role = "User";
        var message = data.username + " | " + role;
        var $msg = $("<h5/>").text(message);
        var $divMsg = $("<div/>").addClass("media-body").append($msg);
        
        var $mediaDiv = $("<div/>").addClass("media").append($userAvatar, $divMsg);
        var $messageDiv = $("<div/>").addClass("media-body").append($mediaDiv);
        var $mainLi = $("<li/>").addClass("media").attr("id", data.username).attr("data-toggle", "tooltip").attr("title", "Click for private chat").append($messageDiv);
        
        addMessageElement($mainLi, $("#usersList"));
    }
    
    function addConnectedActiveUsers(connectedUsers) {
        $.each(connectedUsers, function (index, value) {
            var data = { username: value };
            addUserToActiveUsers(data);
        });
    }
    
    function updateChat(message) {
        var $el = $("<li>").addClass("log").text(message);
        addMessageElement($el, $("#chatMessages"));
    }
    
    function cleanInput(input) {
        return $("<div/>").text(input).text();
    }
    
    function sendMessage(data) {
        if (!data) {
            return;
        }
        if (!connected) {
            return;
        }
        
        if (data.to === "all") {
            addChatMessage(data, false);
        } else {
            addChatMessage(data, true);
        }
        
        socket.emit("new message", data);
    }
    
    $("#loginModal").modal({ backdrop: "static" });
    
    $("#usersList").delegate("li", "click", function () {
        $("#privateMsgModal .modal-title").html("Private chat with " + this.id);
        $(".modal-title").attr("id", this.id);
        $("#privateMsgModal").modal({ backdrop: "static" });
    });
    
    $("#btnLogin").click(function () {
        var nickname = $("#inputNickname").val();
        var password = $("#inputPassword").val();
        $.ajax({
            method: "POST",
            url: "/login",
            data: { nickname: nickname, password: password }
        }).done(function (data, error) {
            if (error === "success") {
                username = cleanInput(nickname.trim());
                socket.emit("add user", username);
                
                $("#loginModal").modal("hide");
            } else {
                console.log("Error: " + error);
            }
        });
    });
    
    $("#inputMessage").click(function () {
        $("#inputMessage").focus();
    });
    
    $("#btnSendMessage").click(function () {
        var message = $("#inputMessage").val();
        message = cleanInput(message);
        $("#inputMessage").val("");
        
        var data = { from: username, to: "all", message: message };
        
        sendMessage(data);
    });
    
    $("#btnSendPrivateMessagee").click(function () {
        var message = $("#inputPrivateMessage").val();
        message = cleanInput(message);
        $("#inputPrivateMessage").val("");
        
        var to = $(".modal-title").attr("id");
        var data = { from: username, to: to, message: message };
        
        sendMessage(data);
    });
    


    socket.on("welcome_message", function (data) {
        connected = true;
        updateChat(data.message, { prepend: true });
    });
    
    socket.on("add_to_users_list", function (data) {
        addUserToActiveUsers(data);
    });
    
    socket.on("remove_from_users_list", function (data) {
        $("#" + data.username).remove();
    });
    
    socket.on("fill_connected_users", function (data) {
        addConnectedActiveUsers(data.connectedUsers);
    });
    
    socket.on("chat_message_joined", function (data) {
        updateChat(data.message);
    });
    
    socket.on("chat_message_left", function (data) {
        updateChat(data.message);
    });

    socket.on("participants_message", function (data) {
        updateChat(data.message);
    });

    socket.on("new message", function (data) {
        addChatMessage(data, false);
    });
    
    socket.on("new private message", function (data) {
        addChatMessage(data, true);
    });
});