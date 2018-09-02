const jwt = require('jsonwebtoken');
const config = require('../config');

exports.authenticate = () => {
    return (req, res, next) => {
        req.session = {
            isLoggedIn: false,
            user: null,
        };
        if(!req.headers.authorization){
            return res.status(401).send({ status: 401, message: 'You don\'t have permission to execute this api.' });
        }
        jwt.verify(req.headers.authorization, config.jwt.secret, (err, decoded) => {
            if (err) {
                return res.status(498).send({ status:498, message: 'Token Expired' });
            }
            if (!decoded || decoded.type !== 'auth') {
                return res.status(498).send({ status:498, message: 'Token Expired' });
            }
            req.session.isLoggedIn = true;
            req.session.user = decoded.user_id;
            next();
        });
    };
};