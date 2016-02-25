/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as Actions from '../../../redux/volunteer/actions';
import { connect } from 'react-redux';

/* Then React components */
import AuthenticatedView from '../AuthenticatedView';
import AdminLayout from '../../../components/AdminLayout';
import AdminVolunteersTable from '../../../components/AdminVolunteersTable';
import AdminContentHeader from '../../../components/AdminContentHeader';

class AdminVolunteers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            volunteers: [],
        };
    }

    componentWillMount() {
        document.title = 'Volunteers | Raiserve';

        if (this.props.user) {
            this.doActions(this.props.user);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        } else if (nextProps.volunteers) {
            this.setState(
                {
                    volunteers: nextProps.volunteers,
                    error: null,
                }
            );
        } else if (nextProps.user) {
            this.doActions(nextProps.user)

            this.setState(
                {
                    user: nextProps.user,
                    error: null,
                }
            );
        }
    }

    doActions = ((user) => {
        const roles = user.roles;

        if (roles.indexOf('SUPER_ADMIN') >= 0) {
            Actions.getVolunteers()(this.props.dispatch);
        } else if (roles.indexOf('PROJECT_LEADER') >= 0) {
            const projectSlug = user.project.slug;

            Actions.getVolunteers(projectSlug)(this.props.dispatch);
        }

        // Code reminder. TODO move this to Team Leader Team DASHBOARD
        // else if (roles.indexOf('TEAM_LEADER') >= 0) {
        //     const projectSlug = user.project.slug;
        //     const teamSlug = user.team.slug;
        //
        //     Actions.getVolunteers(projectSlug, teamSlug)(this.props.dispatch);
        // }
    });

    render() {
        let header = null;

        if (this.props.user && this.props.user.roles.indexOf('PROJECT_LEADER') >= 0) {
            header = `${this.props.user.project.name} Volunteers`;
        } else {
            header = `Volunteers`;
        }

        return (
            <AuthenticatedView accessLevel={'PROJECT_LEADER'}>
                <AdminLayout>
                    <AdminContentHeader title={header}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <AdminVolunteersTable volunteers={this.state.volunteers}
                        actionable={false}
                    />
                </AdminLayout>
            </AuthenticatedView>
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    error: reduxState.main.volunteer.error,
    volunteers: reduxState.main.volunteer.volunteers,
}))(AdminVolunteers);
