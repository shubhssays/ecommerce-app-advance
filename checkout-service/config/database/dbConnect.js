const dbConnect = {
    development: {
        dialect: "sqlite",
        storage: './database.sqlite',
        logging: console.log
    },
};

module.exports = dbConnect;