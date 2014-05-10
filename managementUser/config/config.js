var Config = {
    mongo: {
        host:"127.0.0.1",
        port:"27017",
        db:"nodetest",
        table : {
            userlist:"userlist",
            messages:"messages"
        }
    },
    process_port: 3002,
    cookie: {
        maxAge: 900000
    },
    socket_io: {
        port:3001
    }
};

module.exports = Config;