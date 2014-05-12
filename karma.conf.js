// karma.conf.js
module.exports = function(config) {
    config.set({
        // at a minimum need requirejs + traceur
        frameworks : ['jasmine', 'requirejs', 'traceur'],

        preprocessors : {
            'js/src/**/*.js' : ['traceur'],
            'js/test/**/*.js' : ['traceur']
        },

        files : [
            {pattern : 'js/src/App-build.js', included : false},
            {pattern : 'js/test/**/*Spec.js', included : false}
        ],

        // default configuration, not required
        traceurPreprocessor : {
            // options passed to the traceur-compiler, see traceur --longhelp for list of options
            options : {
                sourceMap : false,
                modules : 'amd'
            },
            // custom filename transformation function
            transformPath : function(path) {
                return "karma_build/" + path;
            }
        }
    });
};