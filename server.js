const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session');

var application = express();
application.engine('mustache', mustache());

application.set('views', './views');
application.set('view engine', 'mustache');

var users = [{
    email: 'admin@test', 
    name: 'Bruin', 
    password: 'qwer4321',
    views: 0,
    isAuthenticated: false
}];



application.use(cookieParser());
application.use(bodyParser.urlencoded());
application.use(session({
    secret: 'bruinisinthehouse',
    resave: false,
    saveUninitialized: true
}))

application.get('/', (request, response) => {
    if (request.session.isAuthenticated != true){
        response.render('index');
    } else {
        response.redirect('dashboard');
    }
    
})

application.get('/login', (request, response) => {
    response.render('login');
})

application.get('/register', (request, response) => {
    response.render('register');
});

application.post('/register', (request, response) => {
    var user = {
        name: request.body.name, 
        email: request.body.email,
        password: request.body.password, 
        views: 0, 
        isAuthenticated: true
    }
    users.push(user);
    request.session.name = request.body.name;
    request.session.email = request.body.email;
    request.session.views = 1;
    request.session.isAuthenticated = true;

    response.redirect('dashboard')
    
})

application.post('/login', (request, response) => {
    var user = users.find(user => {return user.email === request.body.email && user.password === request.body.password});
    if (user) {
        request.session.isAuthenticated = true;
        request.session.name = user.name;
        request.session.email = user.email;
        request.session.views = 1;

        response.redirect('dashboard');
    } else {
        response.render('login', user)
    }
});

application.get('/dashboard', (request, response) => {

    if(request.session.isAuthenticated === false) {
        render.redirect('login');
    }
    else {
        var user = {
            name: request.session.name,
            email: request.session.email,
            views: request.session.views++
        }
    }
    
    response.render('dashboard', user)
})

application.post('/logout', (request, response) => {
    request.session.destroy(function(err) {
    });
    response.render('login');
})

application.listen(3000);
console.log('application started');