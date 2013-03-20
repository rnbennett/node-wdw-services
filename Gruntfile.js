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

    grunt.registerTask('start-server', function() {
        this.async();
        require('supervisor').run(['app.js']);
    });

    grunt.registerTask('default', ['jshint', 'jasmine_node']);
    grunt.registerTask('server', ['jshint', 'jasmine_node', 'start-server']);
};