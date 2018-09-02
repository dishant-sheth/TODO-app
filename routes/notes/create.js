const Promise = require('bluebird');

const noteSvc = require('../../services/noteSvc');

module.exports = (session, body) => {
    return new Promise((resolve, reject) => {
        if(session.isLoggedIn === true){
            const new_note = {
                todo_item: body.todo_item,
                created_by: session.user
            };
            if(body.deadline){
                new_note.deadline = body.deadline;
            }
            console.log(new_note);
            noteSvc.create(new_note)
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
    });
};
