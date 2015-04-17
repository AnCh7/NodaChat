$(function () {
    
    var socket = io();

    var $loginModal = $("#loginpage"); // Login modal window
    var $inputMessage = $("#inputMessage"); // Input message input box
    var $btnSendMessage = $("#btnSendMessage"); // Send message button
    var $btnLogin = $("#btnLogin"); // Login button
    var $inputNickname = $("#inputNickname"); // Textbox with nickname
    var $inputPassword = $("#inputPassword"); // Textbox with password
    var $chatMessages = $("#chatMessages"); // Messages area
    var $usersList = $("#usersList"); // Users list area
    
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
        var $usernameDiv = $("<span class=\"username\"/>").text(data.username);
        var $messageBodyDiv = $("<span class=\"messageBody\">").text(data.message);
        var $messageDiv = $("<li class=\"message\"/>").data("username", data.username).append($usernameDiv, $messageBodyDiv);
        addChatMessageElement($messageDiv);
    }
    
    function addUsersMessage(data) {
        var $usernameDiv = $("<span class=\"username\"/>").text(data.username);
        var $messageBodyDiv = $("<span class=\"messageBody\">").text(data.message);
        var $messageDiv = $("<li class=\"message\"/>").data("username", data.username).append($usernameDiv, $messageBodyDiv);
        addUsersElement($messageDiv);
    }
    
    function updateChat(message) {
        var $el = $("<li>").addClass("log").text(message);
        addChatMessageElement($el);
    }
    
    function updateUsers(message) {
        var $el = $("<li>").addClass("log").text(message);
        addUsersElement($el);
    }
    
    function addParticipantsMessage(data) {
        var message = "";
        if (data.numUsers === 1) {
            message += "there's 1 participant";
        } else {
            message += "there are " + data.numUsers + " participants";
        }
        updateChat(message);
        updateUsers(message);
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
        
        username = "TestTODO";
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
    
    socket.on("login", function (data) {
        connected = true;
        var message = "Welcome to chat – ";
        updateChat(message, { prepend: true });
        addParticipantsMessage(data);
    });
    
    socket.on("user joined", function (data) {
        updateChat(data.username + " joined");
        addParticipantsMessage(data);
    });
    
    socket.on("new message", function (data) {
        addChatMessage(data);
    });
    
    socket.on("user left", function (data) {
        updateChat(data.username + " left");
        addParticipantsMessage(data);
    });
});