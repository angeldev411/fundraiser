'use strict';
const express = require('express');
const router = express.Router();
import * as AUTH_CHECKER from '../auth/auth-checker';

import projectController from './controller';

router.post('/api/v1/project', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || !AUTH_CHECKER.isSuperAdmin(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    const project = {
        name: req.body.name,
        slug: req.body.slug,
        shortDescription: req.body.shortDescription,
        projectLeaderEmail: req.body.projectLeaderEmail,
    };

    const data = {
        project,
        currentUser: req.session.user,
    };

    projectController.store(data)
    .then((response) => {
        res.status(200).send(response);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

router.put('/api/v1/project/:projectId', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || !AUTH_CHECKER.isSuperAdmin(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    const project = {
        name: req.body.name,
        slug: req.body.slug,
        shortDescription: req.body.shortDescription,
        projectLeaderEmail: req.body.projectLeaderEmail,
    };

    const data = {
        project,
        currentUser: req.session.user,
    };

    projectController.update(data, req.params.projectId)
    .then((response) => {
        res.status(200).send(response);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

router.get('/api/v1/project', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || !AUTH_CHECKER.isSuperAdmin(req.session.user)
    ) {
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
        res.status(400).send(err);
    });
});

router.get('/api/v1/project/:projectSlug', (req, res) => {
    projectController.getProject(req.params.projectSlug)
    .then((response) => {
        res.status(200).send(response);
    })
    .catch((err) => {
        res.status(404).send('Project not found');
    });
});

module.exports = router;
