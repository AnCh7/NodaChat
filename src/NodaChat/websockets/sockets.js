module.exports = function (app, io) {
    
    "use strict";
    
    function createParticipantsMessage(connectedUsers) {
        var message = "";
        if (Object.keys(connectedUsers).length === 1) {
            message += "there's 1 participant";
        } else {
            message += "there are " + Object.keys(connectedUsers).length + " participants";
        }
        return message;
    }

    var connectedUsers = {};
    
    io.on("connection", function (socket) {
        var addedUser = false;
        
        socket.on("new message", function (data) {
            if (data.to === "all") {
                socket.broadcast.emit("new message", {
                    from: socket.userEmail,
                    to: "all",
                    message: data.message
                });
            } else {
                connectedUsers[data.to].emit('new private message', data);
            }
        });
        
        socket.on("add user", function (userEmail) {
            socket.userEmail = userEmail;
            addedUser = true;
            
            socket.emit("welcome_message", {
                message: "Welcome to chat - " + userEmail + " !"
            });
            
            socket.emit("add_to_users_list", {
                userEmail: userEmail
            });
            
            socket.broadcast.emit("add_to_users_list", {
                userEmail: userEmail
            });
            
            socket.emit("fill_connected_users", {
                connectedUsers: Object.keys(connectedUsers)
            });
            
            socket.broadcast.emit("chat_message_joined", {
                message: socket.userEmail + " joined"
            });
           
            socket.emit("participants_message", {
                message: createParticipantsMessage(connectedUsers)
            });
            
            connectedUsers[userEmail] = socket;
        });
        
        socket.on("disconnect", function () {
            if (addedUser) {
                delete connectedUsers[socket.userEmail];
                
                socket.broadcast.emit("remove_from_users_list", {
                    userEmail: socket.userEmail
                });

                socket.emit("participants_message", {
                    message: createParticipantsMessage(connectedUsers)
                });

                socket.broadcast.emit("chat_message_left", {
                    message: socket.userEmail + " left"
                });
            }
        });
    });
};