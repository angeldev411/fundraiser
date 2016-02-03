
import React from 'react';
import { IndexRoute, Route } from 'react-router';

/* Urls */
import * as Urls from '../urls.js';

/* Add new views here */
import Home from '../views/Home';
import SuperAdminProjects from '../views/Admin/SuperAdminProjects';


export default (
    <Route
        path={Urls.ADMIN_BASE_URL}
    >
        <IndexRoute
            component={Home}
        />
        /* Add new routes here */
        <Route
            path={Urls.ADMIN_PROJECTS}
            component={SuperAdminProjects}
        />
    </Route>
);
