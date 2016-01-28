
import React from 'react';
import { IndexRoute, Route } from 'react-router';

import Container from './components/Container';
import RouteNotFound from './views/RouteNotFound';

/* Urls */
import * as Urls from './urls.js';

/* Add new views here */
import Home from './views/Home';
import Founders from './views/Founders';
import Story from './views/Story';
import RaiserveBasics from './views/RaiserveBasics';
import TeamProfile from './views/TeamProfile';
import TeamSignup from './views/TeamSignup';
import Legals from './views/Legals';

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
            path={Urls.STORY}
            component={Story}
        />
        <Route
            path={Urls.RAISERVEBASICS}
            component={RaiserveBasics}
        />
        <Route
            path={`${Urls.TEAMPROFILE}/:teamSlug`}
            component={TeamProfile}
        />
        <Route
            path={`${Urls.TEAMPROFILE}/:teamSlug/signup`}
            component={TeamSignup}
        />
        <Route
            path={Urls.LEGALS}
            component={Legals}
        />
        <Route
            path="*"
            component={RouteNotFound}
            status={404}
        />
    </Route>
);
