var _ = require('lodash');
var path = require('path');
var fs = require('fs-extra');

module.exports = function (imports) {

  var root = imports.root;
  var name = imports.name;
  // var deps = imports.deps;

  // deps = deps || {};

  // return _(deps).keys().value();
  
  var elements = [];
    
  var packageFolders = path.resolve(root, 'bower_components/' + name + '/dist');
  if (fs.existsSync(packageFolders)) {
      var folders = fs.readdirSync(packageFolders)
          .filter(function(file) {
              return fs.statSync(path.join(packageFolders, file)).isDirectory();
          });

      elements = folders.filter(function(element) {
          if (element.indexOf('nd') > -1) {
              return element;
          }
      });
  }
  
  return elements;
}