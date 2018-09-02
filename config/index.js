console.log('using localhost config');

const config = {};

config.db = {
    uri: 'mongodb://localhost:27017/todoapp',
    options: {},
};

config.jwt = {
    secret: 'shhhhhh12345',
    token_timeout: '12h' 
};

config.facebookAuth = {
    clientID      : '233944160631891',
    clientSecret  : '65ab0e35ce74695190729aa2766498de', 
    callbackURL  : 'http://localhost:3000/accounts/facebook/callback',
    profileURL   : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'
};

config.googleAuth = {
    clientID      : '233395120099-n6lv86lr13fia4ga8ejk3ovppl4u0v27.apps.googleusercontent.com',
    clientSecret  : 'Si8NPCS9C6d58CVgVCgMu4M6',
    callbackURL   : 'http://localhost:3000/accounts/google/callback'
};


module.exports = config;
