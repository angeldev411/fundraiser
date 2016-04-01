/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as Actions from '../../../redux/team/actions';
import { connect } from 'react-redux';

/* Then React components */
import Page from '../../../components/Page';
import AdminLayout from '../../../components/AdminLayout';
import AdminTeamsTable from '../../../components/AdminTeamsTable';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminTeamForm from '../../../components/AdminTeamForm';
import lodash from 'lodash';

class AdminTeams extends Component {

    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            sortBy: null,
            ASC: true,
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
        }
        if (nextProps.teams) {
            this.setState(
                {
                    teams: nextProps.teams,
                    error: null,
                }
            );
        }
        if (nextProps.team && (!this.props.team || nextProps.team !== this.props.team)) {
            const ids = [];
            for (let i = 0; i < this.state.teams.length; i++) {
                ids.push(this.state.teams[i].id);
            }

            if (ids.indexOf(nextProps.team.id) > -1) {
                this.updateTeam(nextProps.team, ids.indexOf(nextProps.team.id));
            } else {
                this.newTeam(nextProps.team);
            }

        }
        if (nextProps.user && nextProps.user !== this.props.user) {
            Actions.indexTeams(nextProps.user.project.slug)(this.props.dispatch);

            this.setState(
                {
                    user: nextProps.user,
                    error: null,
                }
            );
        }
    }

    newTeam = (team) => {
        const newState = Object.assign({}, this.state);

        newState.teams.unshift(team);
        this.setState(newState);
    };

    updateTeam = (team, teamIndex) => {
        const newState = Object.assign({}, this.state);

        newState.teams[teamIndex] = team;
        this.setState(newState);
    };

    onSort = (column) => {
        let teams = lodash.sortBy(this.state.teams, (team) => {
            return team[column].toString().toLowerCase();
        });

        if (!this.state.ASC) {
            teams = lodash.reverse(teams);
        }

        this.setState({
            sortBy: column,
            ASC: !this.state.ASC,
            teams,
        });
    };

    render() {
        if (!this.props.user) {
            return (null);
        }

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
            <Page>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={`${this.props.user.project.name} Teams`}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <AdminTeamsTable
                        teams={this.state.teams}
                        project={this.props.user.project}
                        actionable={true}
                        onSort={this.onSort}
                        user={this.props.user}
                    />
                </AdminLayout>
            </Page>
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    error: reduxState.main.team.error,
    teams: reduxState.main.team.teams,
    team: reduxState.main.team.team,
}))(AdminTeams);
