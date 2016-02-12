
import React from 'react';
import { IndexRoute, Route } from 'react-router';

import Container from '../components/Container';

/* Urls */
import * as Urls from '../urls.js';

/* Add new views here */
import Home from '../views/Home';
import Founders from '../views/Founders';
import Story from '../views/Story';
import RaiserveBasics from '../views/RaiserveBasics';
import TeamProfile from '../views/TeamProfile';
import TeamSignup from '../views/TeamSignup';
import VolunteerProfile from '../views/VolunteerProfile';
import Legals from '../views/Legals';
import Privacy from '../views/Privacy';

export default (
    <Route
        path={Urls.BASE_URL}
        component={Container}
    >
        <IndexRoute
            component={Home}
        />
        /* Add new routes here */
        <Route
            path={Urls.FOUNDERS}
            component={Founders}
        />
        <Route
            path={Urls.STORY}
            component={Story}
        />
        <Route
            path={Urls.RAISERVE_BASICS}
            component={RaiserveBasics}
        />
        <Route
            path={`${Urls.TEAM_PROFILE}`}
            component={TeamProfile}
        />
        <Route
            path={`${Urls.TEAM_SIGNUP}`}
            component={TeamSignup}
        />
        <Route
            path={`${Urls.VOLUNTEER_PROFILE}`}
            component={VolunteerProfile}
        />
        <Route
            path={Urls.LEGALS}
            component={Legals}
        />
        <Route
            path={Urls.PRIVACY}
            component={Privacy}
        />
    </Route>


);
