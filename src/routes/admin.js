
import React from 'react';
import { IndexRoute, Route } from 'react-router';
import requireAuthentication from '../views/Admin/AuthenticatedView';

/* Urls */
import * as Urls from '../urls.js';

/* Add new views here */
import Home from '../views/Home';
import AdminProjects from '../views/Admin/AdminProjects';
import AdminSettings from '../views/Admin/AdminSettings.js';
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
            path={Urls.ADMIN_SETTINGS}
            component={requireAuthentication(AdminSettings, 'SUPER_ADMIN')}
        />
        <Route
            path={Urls.ADMIN_PROJECTS}
            component={requireAuthentication(AdminProjects)}
        />
        <Route
            path={Urls.ADMIN_VOLUNTEERS}
            component={requireAuthentication(AdminVolunteers, 'PROJECT_LEADER')}
        />
        <Route
            path={Urls.ADMIN_SPONSORS}
            component={requireAuthentication(AdminSponsors, 'PROJECT_LEADER')}
        />
        <Route
            path={Urls.ADMIN_TEAMS}
            component={requireAuthentication(AdminTeams, 'PROJECT_LEADER')}
        />

        <Route
            path={Urls.ADMIN_TEAM_DASHBOARD}
            component={requireAuthentication(AdminTeamDashboard, 'TEAM_LEADER')}
        />
        <Route
            path={Urls.ADMIN_TEAM_PROFILE}
            component={requireAuthentication(AdminTeamProfile, 'TEAM_LEADER')}
        />
        <Route
            path={Urls.ADMIN_TEAM_SPONSORS}
            component={requireAuthentication(AdminTeamSponsors, 'TEAM_LEADER')}
        />
        <Route
            path={Urls.ADMIN_TEAM_VOLUNTEERS}
            component={requireAuthentication(AdminTeamVolunteers, 'TEAM_LEADER')}
        />

        <Route
            path={Urls.ADMIN_VOLUNTEER_DASHBOARD}
            component={requireAuthentication(AdminVolunteerDashboard, 'VOLUNTEER')}
        />
        <Route
            path={Urls.ADMIN_VOLUNTEER_PROFILE}
            component={requireAuthentication(AdminVolunteerProfile, 'VOLUNTEER')}
        />
        <Route
            path={Urls.ADMIN_VOLUNTEER_SPONSORS}
            component={requireAuthentication(AdminVolunteerSponsors, 'VOLUNTEER')}
        />
    </Route>
);
