/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        fixturesPath: "fixtures",

        htmlbuild: {
            dist: {
                src: 'templates/index.html',
                dest: '',
                options: {
                    beautify: true,
                    relative: true,
                    scripts: {
                        source: [
                            'samples/**/*.js',
                            '!samples/**/*.spec.js'
                        ],
                        specs: [
                            'samples/**/*spec.js'
                        ]
                    },
                    data: {
                        // Data to pass to templates
                        version: "0.1.0",
                        title: "test"
                    }
                }
            }
        }
    });

    // load the HTML build task
    grunt.loadNpmTasks('grunt-html-build');
    // Default task.
    grunt.registerTask('default', ['htmlbuild']);

};