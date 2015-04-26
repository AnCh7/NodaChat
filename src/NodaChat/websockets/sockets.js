module.exports = function (app, io) {
    
    var connectedUsers = {};
    
    io.on("connection", function (socket) {
        var addedUser = false;
        
        socket.on("new message", function (data) {
            if (data.to === "all") {
                socket.broadcast.emit("new message", {
                    from: socket.username,
                    to: "all",
                    message: data.message
                });
            } else {
                connectedUsers[data.to].emit('new private message', data);
            }
        });
        
        socket.on("add user", function (username) {
            socket.username = username;
            addedUser = true;
            
            socket.emit("welcome_message", {
                message: "Welcome to chat - " + username + " !"
            });
            
            socket.emit("add_to_users_list", {
                username: username
            });
            
            socket.broadcast.emit("add_to_users_list", {
                username: username
            });
            
            socket.emit("fill_connected_users", {
                connectedUsers: Object.keys(connectedUsers)
            });
            
            socket.broadcast.emit("chat_message_joined", {
                message: socket.username + " joined"
            });
            
            var message = "";
            if (Object.keys(connectedUsers).length === 1) {
                message += "there's 1 participant";
            } else {
                message += "there are " + Object.keys(connectedUsers).length + " participants";
            }
            socket.emit("participants_message", {
                message: message
            });
            
            connectedUsers[username] = socket;
        });
        
        socket.on("disconnect", function () {
            if (addedUser) {
                delete connectedUsers[socket.username];
                
                socket.broadcast.emit("remove_from_users_list", {
                    username: socket.username
                });
                
                var message = "";
                if (Object.keys(connectedUsers).length === 1) {
                    message += "there's 1 participant";
                } else {
                    message += "there are " + Object.keys(connectedUsers).length + " participants";
                }
                socket.emit("participants_message", {
                    message: message
                });

                socket.broadcast.emit("chat_message_left", {
                    message: socket.username + " left"
                });
            }
        });
    });
};