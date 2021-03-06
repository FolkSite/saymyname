
function SayMyName(fullname, name) {

  if (typeof this !== "object") {
    throw new Error("SayMyName needs to be instanciated with new. new SayMyName(.)");
  }

  if (fullname == null) {
    return '';
  }

  if (name == null) {
    this.firstname = parseFirstName(fullname.split(' ')[0]);
    this.name      = parseName(fullname.slice(this.firstname.length));
  }
  else {
    this.firstname = parseFirstName(fullname);
    this.name      = parseName(name);
  }

  this.humanize = function() {
    var humanName = this.firstname + ' ' + this.name;
    return humanName.trim();
  }

}

/* parts of the name that will stay in lowercase
 * if a caps is present, the name will be parsed exactly as it is
 * ex: "Van" permits to keep a majuscule if the name contains Van 
 * note: VAN, VAn, VaN will get caught by van (toLowerCase)
 */

var elts = [
  "des",
  "De", // can be with a cap (Netherlands)
  "de", // lot of countries
  "le", // french
  "du", // french
  "d'", // french and
  "l'", //
  "di", // Italiaanoo
  "Van", 
  "van",
  "von", // neerlands
  "ten",
  "ter",
  "te",
  "zu",
  "of",
  "af"
];

var uppercase = function(name) {
  // if the name contains an hyphen
  if (name.indexOf('-') !== -1) {
    return uppercase(name.split('-')[0]) + '-' + uppercase(name.split('-')[1])
  }
  return name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();
}

/* Firstname should not contains space, only hyphens */
var parseFirstName = function(firstname) {
  var ftab = firstname.split(/ |-/)
  for (var i=0; i < ftab.length; i++){
    ftab[i] = uppercase(ftab[i]);
  }
  return ftab.join('-');
}

var parseName = function(name,parts) {

  if (parts == null) {
    parts = [];
  }

  if (name === '') {
    // specially for d' or l', avoid a space after
    return parts.join(' ').split("' ").join("'");
  }

  name  = name.trim();
  var s = name.split(' ');

  for (var i = 0; i < elts.length; i++) {

    var e = elts[i];

    // space after a nobiliary particle if it is not a quote (l', d' etc)
    var separator = e.slice(-1) == "'" ? '' : ' ';

    // if elts has caps, we match the exact term
    var withCase = e.match(/[A-Z]/) != null; 
    if ((withCase ? name : name.toLowerCase()).indexOf(e+separator) === 0) {
      return parseName( name.slice(e.length), parts.concat(withCase ? uppercase(e) : e) );
    }

  }

  return parseName( name.slice(s[0].length), parts.concat(uppercase(s[0])) );

}

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
var root = typeof self == 'object'   && self.self === self       && self ||
           typeof global == 'object' && global.global === global && global || this;

if (typeof module != 'undefined' && !module.nodeType && module.exports) {
  module.exports = SayMyName;
}
else {
  root.SayMyName = SayMyName;
}

