const Promise = require('bluebird');
const jwt = require('jsonwebtoken');

const config = require('../../config');
const userSvc = require('../../services/userSvc');

module.exports = (body) => {
    return new Promise((resolve, reject) => {
        if(!body.email || !body.password){
            reject({ status: 400, message: 'Kindly check body data.'});
        }
        const query = {
            q: {
                email: body.email
            }
        };
        let user = null;
        userSvc.find(query)
            .then((response) => {
                if(!response.length){
                    return Promise.reject({ status: 401, message: 'Email or password is wrong.' });
                }
                user = response[0];
                console.log(user);
                if(!user.password){
                    return Promise.reject({ status: 401, message: 'Social signup was used with this email.' });
                }
                return userSvc.comparePassword(user.password, body.password);
            })
            .then((status) => {
                if(!status){
                    return Promise.reject({ status: 401, message: 'Email or password is wrong.' });
                }
                
                const auth_token = jwt.sign({
                    user_id: user._id,
                    type: 'auth'
                }, config.jwt.secret , {
                    expiresIn: config.jwt.token_timeout
                });
                resolve({
                    auth_token,
                    _id: user._id,
                    name: user.name,
                    email: user.email
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
};