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
    paths: {
      app: 'app',

      index: '<%= paths.app %>/index.html',
      scripts: '<%= paths.app %>/scripts/**/*.js',
      styles: '<%= paths.app %>/styles/**/*.scss',
      views: '<%= paths.app %>/templates/**/*.html',

      files: {
        sass: '<%= paths.app %>/styles/styles.scss',
        templates: '<%= paths.app %>/scripts/templates.js'
      },

      all: [
        '<%= paths.index %>',
        '<%= paths.scripts %>',
        '<%= paths.styles %>',
        '<%= paths.views %>'
      ],

      build: 'build',

      vendors: '<%= paths.build %>/components',

      buildDirs: {
        styles: '<%= paths.build %>/styles',
        scripts: '<%= paths.build %>/scripts',
      },

      buildFiles: {
        index: '<%= paths.build %>/index.html',
        styles: '<%= paths.buildDirs.styles %>/main.css',
        scripts: '<%= paths.buildDirs.scripts %>/main.js'
      }
    },

    /* Clean build directories
    *************************************************/
    clean: [
      '<%= paths.buildFiles.index %>',
      '<%= paths.buildDirs.styles %>',
      '<%= paths.buildDirs.scripts %>'
    ],

    /* Copy/Compile component files
    *************************************************/
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= paths.app %>',
            dest: '<%= paths.build %>',
            src: [
              '*.{ico,png,txt}',
              '*.html'
            ]
          }
        ]
      }
    },

    ngtemplates:  {
      app: {
        cwd: '<%= paths.app %>',
        src: ['templates/**/*.html'],
        dest: '<%= paths.files.templates %>',
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

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= paths.buildFiles.styles %>': ['<%= paths.files.sass %>']
        }
      }
    },

    /* JS/CSS processing
    *************************************************/
    uglify: {
      options: {
        mangle: false,
        compress: false,
        beautify: true,
        expand: true,
      },

      dev: {
        files: [{
          expand: true,
          cwd: '<%= paths.app %>/scripts',
          src: '**/*.js',
          dest: '<%= paths.buildDirs.scripts %>'
        }]
      },

      dist: {
        options: {
          compress: {
            drop_console: true,
            keep_fargs: true,
            hoist_funs: false,
            hoist_vars: false
          }
        },

        files: {
          '<%= paths.buildFiles.scripts %>' : [ '<%= paths.scripts %>' ]
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
        src: '<%= paths.buildDirs.styles %>/**/*.css'
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
      target: {
        files: [{
          expand: true,
          cwd: '<%= paths.buildDirs.styles %>',
          src: ['*.css', '!*.min.css'],
          dest: '<%= paths.buildDirs.styles %>'
        }]
      }
    },

    /* Wire Dependencies
    *************************************************/

    tags: {

      options: {
        scriptTemplate: '<script type="text/javascript" src="{{ path }}"></script>',
        linkTemplate: '<link rel="stylesheet" type="text/css" href="{{ path }}">'
      },

      styles: {
        options: {
          openTag: '<!-- styles files -->',
          closeTag: '<!-- /styles files -->'
        },
        src: ['<%= paths.buildDirs.styles %>/**/*.css'],
        dest: '<%= paths.buildFiles.index %>'
      },

      scripts: {
        options: {
          openTag: '<!-- scripts files -->',
          closeTag: '<!-- /scripts files -->'
        },
        src: ['<%= paths.buildDirs.scripts %>/**/*.js'],
        dest: '<%= paths.buildFiles.index %>'
      },

      vendors: {
        options: {
          openTag: '<!-- vendors files -->',
          closeTag: '<!-- /vendors files -->'
        },
        src: [
          '<%= paths.vendors %>/angular/angular.js',
          '<%= paths.vendors %>/angular-cookies/angular-cookies.js',
          '<%= paths.vendors %>/angular-resource/angular-resource.js',
          '<%= paths.vendors %>/angular-sanitize/angular-sanitize.js',
          '<%= paths.vendors %>/angular-toastr/dist/angular-toastr.tpls.js',
          '<%= paths.vendors %>/angular-ui-router/release/angular-ui-router.js',
          '<%= paths.vendors %>/ngstorage/ngStorage.js',
          '<%= paths.vendors %>/underscore/underscore.js'
        ],
        dest: '<%= paths.buildFiles.index %>'
      }
    },

    watch: {
      options: { livereload: true },

      index: {
        files: ['<%= paths.index %>'],
        tasks: []
      },

      styles: {
        files: ['<%= paths.buildDirs.styles %>'],
        tasks: ['_styles', 'tags:styles']
      },

      scripts: {
        files: ['<%= paths.buildDirs.scripts %>'],
        tasks: ['uglify:dev', 'tags:scripts']
      },

      views: {
        files: ['<%= paths.views %>'],
        tasks: ['ngtemplates']
      }
    }
  });

  grunt.registerTask('_start', ['clean', 'copy']);
  grunt.registerTask('_end', ['ngtemplates', 'tags']);

  grunt.registerTask('_styles', ['sass', 'postcss']);

  grunt.registerTask('dev', ['_start', 'uglify:dev', '_styles', '_end']);
  grunt.registerTask('build', ['_start', 'uglify:dist', '_styles', 'cssmin', '_end']);

  grunt.registerTask('default', ['dev', 'watch']);
}
