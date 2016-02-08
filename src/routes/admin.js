
import React from 'react';
import { IndexRoute, Route } from 'react-router';

/* Urls */
import * as Urls from '../urls.js';

/* Add new views here */
import Home from '../views/Home';
import AdminProjects from '../views/Admin/AdminProjects';
import AdminVolunteers from '../views/Admin/AdminVolunteers';
import AdminSponsors from '../views/Admin/AdminSponsors';
import AdminTeams from '../views/Admin/AdminTeams';


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
            component={AdminProjects}
        />
        <Route
            path={Urls.ADMIN_VOLUNTEERS}
            component={AdminVolunteers}
        />
        <Route
            path={Urls.ADMIN_SPONSORS}
            component={AdminSponsors}
        />
        <Route
            path={Urls.ADMIN_TEAMS}
            component={AdminTeams}
        />
    </Route>
);
