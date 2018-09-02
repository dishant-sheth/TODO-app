const Promise = require('bluebird');

const noteSvc = require('../../services/noteSvc');

module.exports = (session, params) => {
    return new Promise((resolve, reject) => {
        if(session.isLoggedIn === true){
            noteSvc.get(params.id)
                .then((response) => {
                    if(response.created_by == session.user){
                        noteSvc.remove(params.id)
                            .then((response) => {
                                resolve(response);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    }
                    else{
                        reject({ status: 401, message: 'You donot have permission to execute this API.' });
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        }
        else{
            reject({ status: 401, message: 'You donot have permission to execute this API.' });
        }
    });
};