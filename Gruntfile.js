'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed MIT */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/*.js'],
        dest: 'dist/jquery.<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/jquery.<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    watch: {
      options: {
        livereload: true
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'concat', 'copy']
      },
      sass: {
        files: '<%= sass.dev.src %>',
        tasks: ['sass', 'copy']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      livereload: {
        files: ['gh-pages/*.html', 'gh-pages/js/*.js', 'gh-pages/css/*.css']
      }
    },
    connect: {
      server: {
        options: {
          hostname: '*',
          port: 9000
        }
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'dist/', src: ['*.js'], dest: 'gh-pages/js/'},
          {expand: true, cwd: 'bower_components/exifreader/js/', src: ['ExifReader.js'], dest: 'gh-pages/lib/'},
          {expand: true, cwd: 'bower_components/jquery/', src: ['jquery.js'], dest: 'gh-pages/lib/'},
          {expand: true, cwd: 'bower_components/moment/', src: ['moment.js'], dest: 'gh-pages/lib/'}
        ]
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'dist/webhook-js.min.css': 'src/webhook-js.sass'
        }
      },
      dev: {
        options: {
          style: 'expanded'
        },
        src: ['src/webhook-js.sass'],
        dest: 'dist/webhook-js.css'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  grunt.registerTask('default', ['test', 'clean', 'sass', 'concat', 'uglify']);
  grunt.registerTask('test', ['jshint', 'connect', 'qunit']);
  grunt.registerTask('server', ['connect', 'watch']);

};
