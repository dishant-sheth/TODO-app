const Promise = require('bluebird');

const Note = require('../models/notes');

exports.create = (data) => {
    return new Promise((resolve, reject) => {
        const note = new Note(data);
        if (note.validateSync()) {
            reject({ status: 400, message: 'Invalid Request' });
        }
        Note.create(note, (err, created_note) => {
            if(err){
                reject({ status: 422, message: err.message });
            }
            resolve(created_note.toObject());
        });
    });
};

exports.find = (query, projection) => {
    return new Promise((resolve, reject) => {
        const project = projection || {};
        const sort = query.sort || {};
        Note.find(query.q)
            .select(project)
            .sort(sort)
            .exec((err, result) => {
                if(err){
                    reject({ status: 422, message: err.message });
                }
                resolve(result);
            });
    });
};

exports.get = (_id, projection) => {
    return new Promise((resolve, reject) => {
        const project = projection || {};
        Note.findById(_id, project, (err, result) => {
            if (err || !result) {
                return reject({ status: 422, message: 'Invalid Note Id' });
              }
              resolve(result.toObject());
        });
    });
};

exports.update = (_id, data) => {
    return new Promise((resolve, reject) => {
        const temp = Object.assign({}, data);
        Note.update({ _id }, temp, (err, result) => {
            if (err) {
                return reject({ status: 422, message: err.message });
            }
            if (result.nMatched === 0) {
                return reject({ status: 404, message: 'Invalid noteId' });
            }
            resolve({ message: 'Note Updated' });
        });
    });
};

exports.remove = (_id) => {
    return new Promise((resolve, reject) => {
        Note.remove({_id: _id}, (err) => {
            if (err) {
                return reject({ status: 422, message: err.message });
            }
            resolve({ message: 'Note deleted.' });
        });
    });
};
