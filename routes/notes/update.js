const Promise = require('bluebird');

const noteSvc = require('../../services/noteSvc');

module.exports = (session, params, body) => {
    return new Promise((resolve, reject) => {
        if(session.isLoggedIn === true){
            noteSvc.get(params.id)
                .then((response) => {
                    if(response.created_by == session.user){
                        noteSvc.update(params.id, body)
                            .then((response) => {
                                resolve(response);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    }
                })
                .catch((err) => {
                    reject({ status: 401, message: 'You donot have permission to execute this API.' });
                });
        }
        else{
            reject({ status: 401, message: 'You donot have permission to execute this API.' });
        }
    });
};