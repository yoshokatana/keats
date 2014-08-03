var koa = require('koa')
  , route = require('koa-route')
  , views = require('koa-views')
  , serve = require('koa-static')
  , json = require('koa-json')
  , fs = require('fs');

var app = koa();

// static file serving
app.use(serve('dist'));

// pretty json
app.use(json());

// jade templates
app.use(views('templates', {
  default: 'jade'
}));

// x-response-time
app.use(function *(next){
  var start = new Date();
  yield next;
  var ms = new Date() - start;
  this.set('X-Response-Time', ms + 'ms');
});
 
// logger
app.use(function *(next){
  var start = new Date();
  yield next;
  var ms = new Date() - start;
  console.log('%s %s in %sms', this.method, this.url, ms);
});

// catch 404 errors
app.use(function* (next) {
  yield next;
  if (this.response.status === 404) {
    this.locals.pageName = '404';
    yield this.render('404', this.locals);
  }
});

// ua sniffing for easter eggs
app.use(function* (next) {
  var userAgent = this.request.header['user-agent'];

  function ua(string) {
    return userAgent.toLowerCase().indexOf(string) !== -1;
  }

  if (ua('android')) {
    this.locals.uaClass = 'android';
  } else if (ua('playstation') || ua('nintendo wii') || ua('nitro')) {
    this.locals.uaClass = 'game-console';
  } else {
    this.locals.uaClass = '';
  }

  yield next;
});

// require fs so we can include svg files dynamically
app.use(function* (next) {
  this.locals.fs = fs;
  yield next;
});

// populate data when the server starts
var projects = JSON.parse(fs.readFileSync('data/projects.json'));
var socials = JSON.parse(fs.readFileSync('data/social.json'));
var jobs = JSON.parse(fs.readFileSync('data/jobs.json'));
var interests = JSON.parse(fs.readFileSync('data/interests.json'));

// setup routes

// homepage
app.use(route.get('/', function *(){
  this.body = 'homepage';
}));

// work page
app.use(route.get('/work', function *(){
  this.locals.pageName = 'Work';
  this.locals.projects = projects;
  this.locals.socials = socials;
  yield this.render('work', this.locals);
}));

// work json
app.use(route.get('/work.json', function *(){
  var workJson = projects;
  this.body = workJson;
}));

// resume page
app.use(route.get('/resume', function *(){
  this.locals.pageName = 'Resume';
  this.locals.jobs = jobs;
  this.locals.interests = interests;
  this.locals.socials = socials;
  yield this.render('resume', this.locals);
}));

// resume json
app.use(route.get('/resume.json', function *(){
  this.body = { resume: 'json' };
}));

app.listen(3000);
console.log('listening on port 3000');