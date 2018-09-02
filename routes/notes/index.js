const express = require('express');

const auth = require('../../lib/auth');
const create = require('./create');
const find = require('./find');
const get = require('./get');
const remove = require('./remove');
const update = require('./update');

const router = express.Router();

router.post('/', auth.authenticate() ,(req, res) => {
    create(req.session, req.body)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

router.get('/', auth.authenticate(), (req, res) => {
    find(req.session)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

router.get('/:id', auth.authenticate(), (req, res) => {
    get(req.session, req.params)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

router.delete('/:id', auth.authenticate(), (req, res) => {
    remove(req.session, req.params)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

router.put('/:id', auth.authenticate(), (req, res) => {
    update(req.session, req.params, req.body)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

module.exports = router;