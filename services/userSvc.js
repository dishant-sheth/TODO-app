const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.create = (data) => {
    return new Promise((resolve, reject) => {
        const user = new User(data);
        if (user.validateSync()) {
            reject({ status: 400, message: 'Invalid Request' });
        }
        User.create(user, (err, created_user) => {
            if(err){
                reject({ status: 422, message: err.message });
            }
            resolve(created_user.toObject());
        });
    });
};



exports.comparePassword = (hash, password) => {
    return new Promise((resolve) => {
        bcrypt.compare(password, hash, (err, isMatch) => {
          if (err || !isMatch) {
            return resolve(false);
          }
          resolve(true);
        });
    });
};

exports.find = (query, projection) => {
    return new Promise((resolve, reject) => {
        const project = projection || {};
        const sort = query.sort || {};
        User.find(query.q)
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

exports.update = (_id, data) => {
    return new Promise((resolve, reject) => {
        const temp = Object.assign({}, data);
        User.update({ _id }, temp, (err, result) => {
            if (err) {
                return reject({ status: 422, message: err.message });
            }
            if (result.nMatched === 0) {
                return reject({ status: 404, message: 'Invalid UserId' });
            }
            resolve({ message: 'User Updated' });
        });
    });
};