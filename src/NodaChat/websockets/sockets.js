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

        socket.on("add user", function(username) {
            socket.username = username;

            connectedUsers[username] = username;
            ++numberOfUsers;
            addedUser = true;

            socket.emit("login", {
                numUsers: numberOfUsers,
                username: username
            });
            socket.broadcast.emit("user joined", {
                username: socket.username,
                numUsers: numberOfUsers
            });
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