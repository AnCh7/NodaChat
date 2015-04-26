$(function () {
    
    "use strict";
    
    var socket = io();
    var userEmail;
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
        var message = data.userEmail + " | " + role;
        var $msg = $("<h5/>").text(message);
        var $divMsg = $("<div/>").addClass("media-body").append($msg);
        
        var $mediaDiv = $("<div/>").addClass("media").append($userAvatar, $divMsg);
        var $messageDiv = $("<div/>").addClass("media-body").append($mediaDiv);
        var $mainLi = $("<li/>").addClass("media").attr("id", data.userEmail).attr("data-toggle", "tooltip").attr("title", "Click for private chat").append($messageDiv);
        
        addMessageElement($mainLi, $("#usersList"));
    }
    
    function addConnectedActiveUsers(connectedUsers) {
        $.each(connectedUsers, function (index, value) {
            var data = { userEmail: value };
            addUserToActiveUsers(data);
        });
    }
    
    function updateChat(message) {
        var $el = $("<li>").addClass("log").text(message);
        addMessageElement($el, $("#chatMessages"));
    }
    
    function validateInput(input) {
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
        if (this.id !== userEmail) {
            $("#privateMsgModal .modal-title").html("Private chat with " + this.id);
            $(".modal-title").attr("id", this.id);
            $("#privateMsgModal").modal({ backdrop: "static" });
        }
    });
    
    $("#btnLogin").click(function () {
        var email = $("#inputEmail").val();
        var password = $("#inputPassword").val();
        $.ajax({
            method: "POST",
            url: "/login",
            data: { email: email, password: password }
        }).done(function (msg) {
            if (msg.success) {
                userEmail = msg.data.email;
                socket.emit("add user", msg.data.email);
                $("#loginModal").modal("hide");
            } else {
                var errors = msg.data;
                $("#emailError").text("");
                $("#passwordError").text("");
                errors.forEach(function (error) {
                    if (error.param === "email") {
                        $("#emailError").html(error.msg);
                    }
                    if (error.param === "password") {
                        $("#passwordError").html(error.msg);
                    }
                });
                console.log("Error: " + msg.data);
            }
        });
    });
    
    $("#inputMessage").click(function () {
        $("#inputMessage").focus();
    });
    
    $("#btnSendMessage").click(function () {
        var message = $("#inputMessage").val();
        $("#inputMessage").val("");
        message = validateInput(message);
        if (message) {
            var data = { from: userEmail, to: "all", message: message };
            sendMessage(data);
        }
    });
    
    $("#btnSendPrivateMessagee").click(function () {
        var message = $("#inputPrivateMessage").val();
        $("#inputPrivateMessage").val("");
        message = validateInput(message);
        if (message) {
            var to = $(".modal-title").attr("id");
            var data = { from: userEmail, to: to, message: message };
            sendMessage(data);
        }
    });
    
    socket.on("welcome_message", function (data) {
        connected = true;
        updateChat(data.message, { prepend: true });
    });
    
    socket.on("add_to_users_list", function (data) {
        addUserToActiveUsers(data);
    });
    
    socket.on("remove_from_users_list", function (data) {
        $("#" + data.userEmail).remove();
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