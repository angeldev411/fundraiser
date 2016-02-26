/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as Actions from '../../../redux/team/actions';
import { connect } from 'react-redux';

/* Then React components */
import AuthenticatedView from '../AuthenticatedView';
import AdminLayout from '../../../components/AdminLayout';
import AdminTeamsTable from '../../../components/AdminTeamsTable';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminTeamForm from '../../../components/AdminTeamForm';

class AdminTeams extends Component {

    constructor(props) {
        super(props);
        this.state = {
            teams: []
        };
    }

    componentWillMount() {
        document.title = 'Teams | Raiserve';

        if (this.props.user) {
            Actions.indexTeams(this.props.user.project.slug)(this.props.dispatch);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        } else if (nextProps.teams) {
            this.setState(
                {
                    teams: nextProps.teams,
                    error: null,
                }
            );
        } else if (nextProps.user) {
            Actions.indexTeams(nextProps.user.project.slug)(this.props.dispatch);

            this.setState(
                {
                    user: nextProps.user,
                    error: null,
                }
            );
        }
    }

    render() {
        if (!this.props.user) {
            return (null);
        }

        console.log(this.props.user.project);

        const pageNav = [
            {
                type: 'button',
                title: 'Add New Team',
                content:
                    <AdminTeamForm
                        title={"Add New Team"}
                        defaultData={{ project: this.props.user.project }}
                    />,
            },
        ];


        return (
            <AuthenticatedView accessLevel={'PROJECT_LEADER'}>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={`${this.props.user.project.name} Teams`}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <AdminTeamsTable
                        teams={this.state.teams}
                        project={this.props.user.project}
                        actionable={true}
                    />
                </AdminLayout>
            </AuthenticatedView>
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    error: reduxState.main.team.error,
    teams: reduxState.main.team.teams,
}))(AdminTeams);
