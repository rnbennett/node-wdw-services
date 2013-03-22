path = require('path');

module.exports = {
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