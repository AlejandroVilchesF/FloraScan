module.exports = {
    secret: 'su',
    dburl: process.env.MONGO_DB_URL,
    acronym: process.env.PROJECT_ACRONYM,
    nodemailer: {
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
    }
};