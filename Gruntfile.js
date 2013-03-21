module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            base: {
                src: ['*.js', 'providers/*.js', 'routes/*.js', 'spec/*.js']
            }
        },
        jasmine_node: {
            specNameMatcher: "spec",
            projectRoot: ".",
            requirejs: false,
            forceExit: true,
            jUnit: {
                report: false,
                savePath : "./build/reports/jasmine/",
                useDotNotation: true,
                consolidate: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('create-database', function() {
        //Create application database if it does not exist.
        if (!grunt.file.exists('./app.db')) {
            var sqlite3 = require('sqlite3');
            var db = new sqlite3.Database('./app.db');

            grunt.log.writeln('Creating database. This may take a while...');
            var done = this.async();
            var sql = grunt.file.read('app.sql');
            db.exec(sql, function (err) {
                if (err) throw err;
                grunt.log.writeln('Done.');
                done();
            });
        }
    });

    grunt.registerTask('start-server', function() {
        this.async();
        require('supervisor').run(['app.js']);
    });

    grunt.registerTask('default', ['jshint', 'create-database', 'jasmine_node', 'start-server']);
    grunt.registerTask('test', ['jshint', 'create-database', 'jasmine_node']);
    grunt.registerTask('server', ['create-database', 'start-server']);
};