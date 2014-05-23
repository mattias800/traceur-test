"use strict";

module.exports = function(grunt) {

    grunt.loadNpmTasks("grunt-traceur-simple");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');

    grunt.initConfig({
        traceur : {
            app : {
                files : {
                    'js/src/App-build.js' : ['./js/src/App.js']
                },
                options : {
                    traceurOptions : '--experimental --source-maps --types=true --type-assertions --type-assertion-module="assert" --modules=instantiate'
                }
            },
            test : {
                files : {
                    'js/Test-build.js' : ['./js/test/**/*Spec.js']
                },
                options : {
                    traceurOptions : '--experimental --source-maps --types=true --type-assertions --type-assertion-module="../src/assert"'
                }
            }
        },

        watch : {
            js : {
                files : [
                    'js/src/*.js',
                    'js/test/*Spec.js'
                ],
                tasks : ['default']
            }
        },

        karma : {
            options : {
                files : [
                    'node_modules/grunt-traceur/node_modules/traceur/bin/traceur-runtime.js',
                    'js/Test-build.js'
                ]
            },
            unit : {
                browsers : ['Chrome'],
                singleRun : true,
                frameworks : ['jasmine']
            }
        }
    });

    grunt.registerTask('default',
        [
            "traceur"
        ]);

    grunt.registerTask('test',
        [
            "traceur",
            "karma"
        ]);

};

