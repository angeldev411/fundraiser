
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
import AdminTeamDashboard from '../views/Admin/AdminTeamDashboard';
import AdminTeamProfile from '../views/Admin/AdminTeamProfile';
import AdminTeamSponsors from '../views/Admin/AdminTeamSponsors';
import AdminTeamVolunteers from '../views/Admin/AdminTeamVolunteers';
import AdminVolunteerDashboard from '../views/Admin/AdminVolunteerDashboard';
import AdminVolunteerSponsors from '../views/Admin/AdminVolunteerSponsors';
import AdminVolunteerProfile from '../views/Admin/AdminVolunteerProfile';

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

        <Route
            path={Urls.ADMIN_TEAM_DASHBOARD}
            component={AdminTeamDashboard}
        />
        <Route
            path={Urls.ADMIN_TEAM_PROFILE}
            component={AdminTeamProfile}
        />
        <Route
            path={Urls.ADMIN_TEAM_SPONSORS}
            component={AdminTeamSponsors}
        />
        <Route
            path={Urls.ADMIN_TEAM_VOLUNTEERS}
            component={AdminTeamVolunteers}
        />

        <Route
            path={Urls.ADMIN_VOLUNTEER_DASHBOARD}
            component={AdminVolunteerDashboard}
        />
        <Route
            path={Urls.ADMIN_VOLUNTEER_PROFILE}
            component={AdminVolunteerProfile}
        />
        <Route
            path={Urls.ADMIN_VOLUNTEER_SPONSORS}
            component={AdminVolunteerSponsors}
        />
    </Route>
);
