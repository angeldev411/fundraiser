'use strict';
const express = require('express');
const router = express.Router();

const projectController = require('../project/controller');

router.post('/api/v1/project', (req, res) => {
    // TODO check rights

    const project = {
        name: req.body.name,
        slug: req.body.slug,
        shortDescription: req.body.shortDescription,
        projectLeaderEmail: req.body.projectLeaderEmail,
    };

    if (!req.session.user) {
        res.status(404).send();
        return;
    }

    const data = {
        project,
        currentUser: req.session.user,
    };

    projectController.store(data)
    .then((response) => {
        res.status(200).send(response);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });
});

router.get('/api/v1/project', (req, res) => {
    // TODO check rights

    if (!req.session.user) {
        res.status(404).send();
        return;
    }

    projectController.index()
    .then((response) => {
        const data = [];
        response.map((item) => {
            let project = item.project;
            project.teams = item.teams;
            data.push(project);
        })
        res.status(200).send(data);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });
});

module.exports = router;
