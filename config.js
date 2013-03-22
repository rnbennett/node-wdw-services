path = require('path');

module.exports = {
    mongo: {
        dbUrl: 'https://api.mongolab.com/api/1',            // The base url of the MongoLab DB server
        apiKey: '4fb51e55e4b02e56a67b0b66'                 // Our MongoLab API key
    },
    security: {
        dbName: 'ascrum',                                   // The name of database that contains the security information
        usersCollection: 'users'                            // The name of the collection contains user information
    },
    sqlite: {
        dbPath: path.resolve(__dirname, './app.db')
    },
    touringplans: {
        park: {
            attractionList: 'http://touringplans.com/{{parkPermalink}}/attractions.json',
            attractionDetail: 'http://touringplans.com/{{parkPermalink}}/attractions/{{attractionPermalink}}.json'
        }
    },
    server: {
        listenPort: 3000,                                   // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
        publicFolder: path.resolve(__dirname, './public')   // The folder that contains the application files (note that the files are in a different repository) - relative to this file
    }
};