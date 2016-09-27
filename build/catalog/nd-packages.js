var _ = require('lodash');

var stream = require('./utils/stream').obj;
var packageDetails = require('./utils/nd-package-details');
var packageElements = require('./utils/nd-package-elements');
var parseVersion = require('./utils/parse-version');

module.exports = function (imports) {

  var root = imports.root;
  var bowerFile = require(root + '/bower.json');
  var deps = bowerFile.dependencies;
  var guidesStream = imports.guides;

  return stream.compose(
    stream.parse('packages.*'),
    stream.filter(function (package) {

      return deps[package.name];
    }),
    stream.asyncMap(function (package, done) {

      var details = packageDetails({
        root: root,
        name: 'nd-library/dist/' + package.name
      });

      var elements = packageElements({
        root: root,
        name: package.name
        // deps: details.dependencies
      });

      // Parse all guides and add to packages meta
      guidesStream
        .pipe(stream.filter(function (guide) {

          return guide.package === package.name
        }))
        .pipe(stream.concat(function (guides) {

          package.version = /^[0-9]+\.[0-9]+/.test(details._release) ? details._release : '';
          package.description = details.description;
          package.elements = elements;
          package.guides = _.pluck(guides, 'name');

          console.log("===",package.name,"(" + details._release + ")");

          done(null, package);
        }));
    })
  );
};