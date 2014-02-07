'use strict';

module.exports = function (grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time at the end
  require('time-grunt')(grunt);

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
      dist: ['dist'],
      'gh-pages': ['gh-pages']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/<%= pkg.name %>-*.js'],
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
      all: {
        options: {
          urls: ['http://localhost:9000/test/<%= pkg.name %>.html']
        }
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
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
      demo: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['demo/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    sass: {
      options: {
        loadPath: [
          'bower_components/bourbon/app/assets/stylesheets/',
          'bower_components/neat/app/assets/stylesheets/',
          'bower_components/wyrm/sass/',
          'bower_components/font-awesome/scss/'
        ]
      },
      demo: {
        src: ['demo/*.sass'],
        dest: 'demo/style.css'
      }
    },
    watch: {
      options: {
        livereload: true,
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      demo: {
        files: 'demo/**/*.*',
        tasks: ['jshint:demo']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      sass: {
        files: '<%= sass.demo.src %>',
        tasks: ['sass']
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
    useminPrepare: {
      html: 'demo/index.html',
      options: {
        dest: 'gh-pages/'
      }
    },
    usemin: {
      html: ['gh-pages/index.html']
    },
    copy: {
      files: {
        expand: true,
        cwd: 'demo/',
        src: ['*.html', 'data/*', 'fonts/*'],
        dest: 'gh-pages/'
      }
    },
    'gh-pages': {
      options: {
        base: 'gh-pages'
      },
      src: ['**']
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'connect', 'qunit', 'clean:dist', 'concat', 'uglify']);
  grunt.registerTask('build', ['clean:gh-pages', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'copy', 'usemin']);
  grunt.registerTask('deploy', ['build', 'gh-pages']);
  grunt.registerTask('server', ['connect', 'watch']);
  grunt.registerTask('test', ['jshint', 'connect', 'qunit']);
};
