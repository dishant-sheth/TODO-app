const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const userSvc = require('../../services/userSvc');

module.exports = (body) => {
    return new Promise((resolve, reject) => {
        if(!body.password && !body.facebook_id && !body.google_id){
            reject({ status: 400, message: 'Invalid Request' });
        }
        if(body.facebook_id && !body.token){
            reject({ status: 400, message: 'Invalid Request' });
        }
        if(body.google_id && !body.token){
            reject({ status: 400, message: 'Invalid Request' });
        }
        const new_user = {
            name: body.name,
            email: body.email,
        };
        if(body.password){
            new_user.password = bcrypt.hashSync(body.password, 10);
        }
        else if(body.facebook_id){
            new_user.facebook_id = body.facebook_id;
        }
        else if(body.google_id){
            new_user.google_id = body.google_id;
        }
        else{
            reject({ status: 403, message: 'Social login or password authentication is mandatory'});
        }
        const query = {
            q: {
                email: body.email
            }
        };
        userSvc.find(query)
            .then((response) => {
                if(response.length > 0){
                    console.log('err');
                    return Promise.reject({ status: 403, message: 'This email ID is already in use.'});
                }
                else if(response.length === 0){
                    console.log('hey');
                    
                    console.log(new_user);
                    userSvc.create(new_user)
                        .then((created_user) => {
                            resolve(created_user);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};
