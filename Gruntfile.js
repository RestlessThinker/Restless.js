var module = module || {};
module.exports = function (grunt) {
    var files = [];
    if (grunt.option('files')) {
        files = grunt.option('files').split(',');
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            integration: {
                options: {
                    reporter: 'spec',
                    timeout: 10000
                },
                src: ['tests/*.js']
            }
        }
    });
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.registerTask('default', ['mochaTest']);
}