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
    process_port: 3000
};

module.exports = Config;