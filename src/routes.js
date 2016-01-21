
import React from 'react';
import { IndexRoute, Route } from 'react-router';

import Container from './components/Container';
import RouteNotFound from './views/RouteNotFound';

/* Urls */
import * as Urls from './urls.js';

/* Add new views here */
import Home from './views/Home';
import Founders from './views/Founders';
import HowItWorks from './views/HowItWorks';
import TeamProfile from './views/TeamProfile';

export default (
    <Route
        path="/"
        component={Container}
    >
        <IndexRoute
            component={Home}
        />
        /* Add new routes here */
        <Route
            path="home"
            component={Home}
        />
        <Route
            path={Urls.FOUNDERS}
            component={Founders}
        />
        <Route
            path={Urls.HOWITWORKS}
            component={HowItWorks}
        />
        <Route
            path={`${Urls.TEAMPROFILE}/:teamSlug`}
            component={TeamProfile}
        />
        <Route
            path="*"
            component={RouteNotFound}
            status={404}
        />
    </Route>
);
