
import React from 'react';
import { IndexRoute, Route } from 'react-router';

import Container from './components/Container';
import RouteNotFound from './views/RouteNotFound';
import Home from './views/Home';
/* Add new views here */

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
            path="*"
            component={RouteNotFound}
            status={404}
        />
    </Route>
);
