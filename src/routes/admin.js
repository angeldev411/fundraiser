
import React from 'react';
import { IndexRoute, Route } from 'react-router';

import Container from '../components/Container';
import RouteNotFound from '../views/RouteNotFound';

/* Urls */
import * as Urls from '../urls.js';

/* Add new views here */
import Home from '../views/Home';
import SuperAdminProjects from '../views/Admin/SuperAdminProjects';


export default (
    <Route
        path="/admin"
    >
        <IndexRoute
            component={Home}
        />
        /* Add new routes here */
        <Route
            path={'projects'}
            component={SuperAdminProjects}
        />
    </Route>
);
