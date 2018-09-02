const Promise = require('bluebird');
const facebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');

const userSvc = require('../../services/userSvc');
const config = require('../../config');

module.exports = (passport) => {
    return new Promise((resolve, reject) => {
        let user_details = null;
        passport.use(new facebookStrategy({
            clientID: config.facebookAuth.clientID,
            clientSecret: config.facebookAuth.clientSecret,
            callbackURL: config.facebookAuth.callbackURL,
            profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
            passReqToCallback: true
        },
        (req, token, refreshToken, profile, done) => {
            process.nextTick(() => {
                const query = {
                    q: {
                        facebook_id: profile.id
                    }
                };
                userSvc.find(query)
                    .then((response) => {
                        if(response.length > 0){
                            const auth_token = jwt.sign({
                                user_id: response[0]._id,
                                type: 'auth'
                            }, config.jwt.secret , {
                                expiresIn: config.jwt.token_timeout
                            });
                            const res = {
                                auth_token,
                                _id: response[0]._id,
                                name: response[0].name,
                                email: response[0].email
                            };
                            req.data = res;
                            done(null, res);
                        }
                        else if(response.length === 0){
                            const query1 = {
                                q: {
                                    email: profile.emails[0].value
                                }
                            };
                            userSvc.find(query1)
                                .then((response) => {
                                    if(response.length > 0){
                                        user_details = response[0];
                                        userSvc.update(response[0]._id, {
                                            facebook_id: profile.id
                                        }).then((response) => {
                                            const auth_token = jwt.sign({
                                                user_id: user_details._id,
                                                type: 'auth'
                                            }, config.jwt.secret , {
                                                expiresIn: config.jwt.token_timeout
                                            });
                                            const res = {
                                                auth_token,
                                                _id: user_details._id,
                                                name: user_details.name,
                                                email: user_details.email
                                            };
                                            req.data = res;
                                            done(null, res);
                                        })  
                                        .catch((err) => {
                                            done(err, null);
                                        });
                                    }
                                    else{
                                        const new_user = {
                                            name: profile._json.first_name + ' ' + profile._json.last_name,
                                            email: profile.emails[0].value,
                                            facebook_id: profile.id
                                        };
                                        userSvc.create(new_user)
                                            .then((response) => {
                                                const auth_token = jwt.sign({
                                                    user_id: response._id,
                                                    type: 'auth'
                                                }, config.jwt.secret , {
                                                    expiresIn: config.jwt.token_timeout
                                                });
                                                const res = {
                                                    auth_token,
                                                    _id: response._id,
                                                    name: response.name,
                                                    email: response.email
                                                };
                                                req.data = res;
                                                done(null, res);
                                            })
                                            .catch((err) => {
                                                done(err, null);
                                            });
                                    }
                                })
                                .catch((err) => {
                                    done(err, null);
                                });
                        }
                    })
                    .catch((err) => {
                        done(err, null);
                    });
            });
        }));
    });
};