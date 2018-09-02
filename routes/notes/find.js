const Promise = require('bluebird');

const noteSvc = require('../../services/noteSvc');

module.exports = (session) => {
    return new Promise((resolve, reject) => {
        if(session.isLoggedIn === true){
            const query = {
                q: {
                    created_by: session.user
                }
            };
            noteSvc.find(query)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        }
        else{
            reject({ status: 401, message: 'You donot have permission to execute this API.' });
        }
    });
};
