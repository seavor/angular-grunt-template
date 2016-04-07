module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-script-link-tags');
  grunt.loadNpmTasks('grunt-postcss');

  grunt.initConfig({
    // Predefine paths (eases future development of build script)
    paths: {
      index: 'index.html',

      sass: 'sass',
      mainSass: '<%= paths.sass %>/styles.scss',
      allSass: '<%= paths.sass %>/**/*.scss',

      app: 'app',
      mainApp: '<%= paths.app %>/app.js',
      mainAppDeps: '<%= paths.app %>/app.*.js',

      allApp: [
        '<%= paths.mainApp %>',
        '<%= paths.mainAppDeps %>',
        '<%= paths.app %>/**/*.js'
      ],

      css: 'css',
      mainCss: '<%= paths.css %>/styles.css',

      allCss: [
        '<%= paths.mainCss %>',
        '<%= paths.css %>/**/*.css',
      ],

      js: 'js',
      mainJs: '<%= paths.js %>/app.js',
      mainJsDeps: '<%= paths.js %>/app.*.js',

      allJs: [
        '<%= paths.mainJs %>',
        '<%= paths.mainJsDeps %>',
        '<%= paths.js %>/**/*.js'
      ],

      templates: '<%= paths.app %>/**/*.html',
      templateBundle: '<%= paths.app %>/app.templates.js',

      // Define vendors in order of dependency
      vendors: [
        'node_modules/angular/angular.min.js',
        'node_modules/angular-ui-router/release/angular-ui-router.min.js',
        'node_modules/angular-local-storage/dist/angular-local-storage.min.js'
      ]
    },

    clean: {
      css: ['<%= paths.css %>'],
      js: ['<%= paths.js %>'],

      all: [
        '<%= clean.css %>',
        '<%= clean.js %>'
      ]
    },

    uglify: {
      options: {
        mangle: false,
        compress: {
          drop_console: true,
          keep_fargs: true,
          hoist_funs: false,
          hoist_vars: false
        }
      },

      dev: {
        options: {
          compress: false,
          beautify: true,
          expand: true,
        },
        files: [{
          expand: true,
          cwd: '<%= paths.app %>',
          src: '**/*.js',
          dest: '<%= paths.js %>',
        }]
      },

      pro: {
        files: {
          '<%= paths.mainJs %>' : [
            '<%= paths.mainApp %>',
            '<%= paths.allApp %>'
          ]
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= paths.mainCss %>': '<%= paths.mainSass %>'
        }
      }
    },

    postcss: {
      options: {
        expand: true,
        flatten: true,
        map: true,
        processors: [
          require('autoprefixer-core')({browsers: ['> 1%', 'last 2 versions', 'IE >= 10']})
        ]
      },

      dist: {
        src: '<%= paths.allCss %>'
      }
    },

    cssmin: {
      options: {
        advanced: false,
        aggressiveMerging: false,
        mediaMerging: false,
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      main: {
        files: [{
          expand: true,
          src: '**/*.css',
          cwd: '<%= paths.css %>',
          dest: '<%= paths.css %>'
        }]
      }
    },

    ngtemplates:  {
      app: {
        src: ['<%= paths.templates %>'],
        dest: '<%= paths.templateBundle %>',
        options: {
          htmlmin: {
            collapseBooleanAttributes:      true,
            collapseWhitespace:             true,
            removeAttributeQuotes:          true,
            removeComments:                 true, // Only if you don't use comment directives!
            removeEmptyAttributes:          true,
            removeRedundantAttributes:      true,
            removeScriptTypeAttributes:     true,
            removeStyleLinkTypeAttributes:  true
          }
        }
      }
    },

    tags: {

      options: {
        scriptTemplate: '<script type="text/javascript" src="{{ path }}"></script>',
        linkTemplate: '<link rel="stylesheet" type="text/css" href="{{ path }}">'
      },

      css: {
        options: {
          openTag: '<!-- css files -->',
          closeTag: '<!-- /css files -->'
        },
        src: ['<%= paths.allCss %>'],
        dest: 'index.html'
      },

      vendors: {
        options: {
          openTag: '<!-- vendor files -->',
          closeTag: '<!-- /vendor files -->'
        },
        src: ['<%= paths.vendors %>'],
        dest: 'index.html'
      },

      app: {
        options: {
          openTag: '<!-- app files -->',
          closeTag: '<!-- /app files -->'
        },
        src: ['<%= paths.allJs %>'],
        dest: 'index.html'
      }
    },

    watch: {
      options: { livereload: true },

      index: {
        files: ['<%= paths.index %>'],
        tasks: []
      },

      styles: {
        files: ['<%= paths.allSass %>'],
        tasks: ['cssStack']
      },

      app: {
        files: ['<%= paths.allApp %>'],
        tasks: ['jsStack']
      },

      templates: {
        files: ['<%= paths.templates %>'],
        tasks: ['templates']
      }
    }

  });

  grunt.registerTask('cssStack', ['clean:css', 'sass', 'postcss', 'cssmin', 'tags:css']);
  grunt.registerTask('jsStack', ['clean:js', 'uglify:dev', 'tags:app']);

  grunt.registerTask('vendors', ['tags:vendors']);
  grunt.registerTask('templates', ['ngtemplates']);

  grunt.registerTask('build', [ 'vendors', 'templates', 'cssStack', 'jsStack']);

  grunt.registerTask('default', ['build', 'watch']);

}
