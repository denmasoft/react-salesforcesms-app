var d = new Date(); 
var crypto = require('crypto');
module.exports = {
    stripPrefix: 'build/',
    staticFileGlobs: [
      'build/*.html',
      'build/css/*.css',
      'build/manifest.json',
      'build/js/*.js',
      'build/images/*.{png,jpg,jpeg}',
      'build/font-awesome/4.5.0/**/*.{css,eot,svg,ttf,woff,woff2}',
      'build/static/**/!(*map*)'
    ],
    templateFilePath: 'template.tmpl',
    version: 'v6.0',
    cacheId: crypto.randomBytes(20).toString('hex'),
    cacheName: 'salesforcesmsv6.0',
    dontCacheBustUrlsMatching: /\.\w{8}\./,
    swFilePath: 'build/service-worker.js'
};