$(function () {
    
    var socket = io();

    var $loginModal = $("#loginModal");
    var $privateMsgModal = $("#privateMsgModal");
    var $privateMsgAction = $("#privateMsgAction");
    var $inputMessage = $("#inputMessage");
    var $btnSendMessage = $("#btnSendMessage");
    var $btnLogin = $("#btnLogin");
    var $inputNickname = $("#inputNickname");
    var $inputPassword = $("#inputPassword");
    var $chatMessages = $("#chatMessages");
    var $usersList = $("#usersList");
    
    var username;
    var connected = false;
    
    function addChatMessageElement(el) {
        var $el = $(el);
        $chatMessages.append($el);
        $chatMessages[0].scrollTop = $chatMessages[0].scrollHeight;
    }
    
    function addUsersElement(el) {
        var $el = $(el);
        $usersList.append($el);
        $usersList[0].scrollTop = $usersList[0].scrollHeight;
    }
    
    function addChatMessage(data) {
        
        var avatarUrl = "../images/user.png";
        var $userAvatarImage = $("<img style='max-height:60px;' class=\"media-object img-circle\">").attr("src", avatarUrl);;
        var $userAvatar = $("<a href='#' class=\"pull-left\">").append($userAvatarImage);
        
        var now = new Date();
        var message = data.username + " | " + now;
        var $msg = $("<small class=\"text-muted\">").text(message);
        var $divMsg = $("<div class=\"media-body\">").text(data.message).append("<br/>", $msg, "<hr/>");
        
        var $messageDiv = $("<div class=\"media\">").append($userAvatar, $divMsg);
        var $mainLi = $("<li class=\"media\"/>").append($messageDiv);

        addChatMessageElement($mainLi);
    }
    
    function addUsersMessage(data) {
        
        var avatarUrl = "../images/user.png";
        var $userAvatarImage = $("<img style='max-height:40px;' class=\"media-object img-circle\">").attr("src", avatarUrl);;
        var $userAvatar = $("<a href='#' class=\"pull-left\">").append($userAvatarImage);

        var role = "User";
        var message = data.username + " | " + role;
        var $msg = $("<h5>").text(message);
        var $divMsg = $("<div class=\"media-body\">").append($msg);
        
        var $mediaDiv = $("<div class=\"media\">").append($userAvatar, $divMsg);
        var $messageDiv = $("<div class=\"media-body\" id='context' data-toggle='context' data-target='#context-menu'>").append($mediaDiv);
        var $mainLi = $("<li class=\"media\"/>").append($messageDiv);
        
        addUsersElement($mainLi);
    }
    
    function updateChat(message) {
        var $el = $("<li>").addClass("log").text(message);
        addChatMessageElement($el);
    }
    
    function addParticipantsMessage(data) {
        var message = "";
        if (data.numUsers === 1) {
            message += "there's 1 participant";
        } else {
            message += "there are " + data.numUsers + " participants";
        }
        updateChat(message);
    }
    
    function cleanInput(input) {
        return $("<div/>").text(input).text();
    }
    
    function sendMessage() {

        var message = $inputMessage.val();
        message = cleanInput(message);
        
        if (!message) {
            return;
        }
        if (!connected) {
            return;
        }
        
        $inputMessage.val("");
        addChatMessage({
            username: username,
            message: message
        });
        
        socket.emit("new message", message);
    }
    
    $loginModal.modal({ backdrop: "static" });
    
    $btnLogin.click(function () {
        var nickname = $inputNickname.val();
        var password = $inputPassword.val();
        $.ajax({
            method: "POST",
            url: "/login",
            data: { nickname: nickname, password: password },
        }).done(function (data, error) {
            if (error === "success") {
                username = cleanInput(nickname.trim());
                socket.emit("add user", username);
                
                $loginModal.modal("hide");
            } else {
                console.log("Error: " + error);
            }
        });
    });
    
    $inputMessage.click(function () {
        $inputMessage.focus();
    });
    
    $btnSendMessage.click(function () {
        sendMessage();
    });
    
    $privateMsgAction.click(function () {
        $privateMsgModal.modal({ backdrop: "static" });
    });
    
    socket.on("login", function (data) {
        connected = true;
        var message = "Welcome to chat – ";
        updateChat(message, { prepend: true });
        addParticipantsMessage(data);
        addUsersMessage(data);
    });
    
    socket.on("user joined", function (data) {
        updateChat(data.username + " joined");
        addParticipantsMessage(data);
        addUsersMessage(data);
    });
    
    socket.on("new message", function (data) {
        addChatMessage(data);
    });
    
    socket.on("user left", function (data) {
        updateChat(data.username + " left");
        addParticipantsMessage(data);
    });
});