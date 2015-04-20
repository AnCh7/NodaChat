module.exports = function(app, io) {

    var connectedUsers = {};
    var numberOfUsers = 0;

    io.on("connection", function(socket) {
        var addedUser = false;

        socket.on("new message", function(data) {
            socket.broadcast.emit("new message", {
                username: socket.username,
                message: data
            });
        });
        
        socket.on("new private message", function (data) {
            io.to(socketid).emit('message', 'for your eyes only');
        });

        socket.on("add user", function(username) {
            socket.username = username;
            ++numberOfUsers;
            addedUser = true;

            socket.emit("login", {
                numUsers: numberOfUsers,
                connectedUsers: connectedUsers,
                username: username
            });
            socket.broadcast.emit("user joined", {
                username: socket.username,
                numUsers: numberOfUsers
            });
            connectedUsers[username] = username;
        });

        socket.on("disconnect", function() {
            if (addedUser) {
                delete connectedUsers[socket.username];
                --numberOfUsers;
                socket.broadcast.emit("user left", {
                    username: socket.username,
                    numUsers: numberOfUsers
                });
            }
        });
    });
};