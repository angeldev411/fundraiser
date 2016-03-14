import React, { Component } from 'react';
import AdminTeamForm from '../AdminTeamForm';
import ModalButton from '../ModalButton';

export default class AdminTeamsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: this.props.teams,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.teams) {
            this.setState({
                teams: nextProps.teams,
            });
        }
    }

    updateTeam = (team, teamIndex) => {
        const newState = Object.assign({}, this.state);

        newState.teams[teamIndex] = team;
        this.setState(newState);
    };

    render() {
        return (
            <div className="table-responsive">
                <table className="teams table">
                    <thead>
                        <tr>
                            <th>{'Team Name'}</th>
                            <th>{'Total $'}</th>
                            <th>{'Total hours'}</th>
                            <th>{'# Volunteers'}</th>
                            {this.props.actionable ? <th>{'Actions'}</th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.teams.map((team, i) => (
                            <tr key={i}>
                                <td className={'team-name'}>{team.name}</td>
                                <td>{team.raised}</td>
                                <td>{team.totalHours}</td>
                                <td>{team.totalVolunteers}</td>
                                {this.props.actionable ?
                                    <td>
                                        <div className={'edit-links'}>
                                            <ModalButton customClass="btn-link uppercase"
                                                content={
                                                    <AdminTeamForm title={"Edit team"}
                                                        defaultData={
                                                            {
                                                                project: this.props.project,
                                                                team,
                                                            }
                                                        }
                                                        updateTeam={(team) => {
                                                            this.updateTeam(team, i);
                                                        }}
                                                    />
                                                }
                                            >
                                                {'Edit'}
                                            </ModalButton>
                                            <a href="#"
                                                className={'uppercase'}
                                            >{'Remove'}</a>
                                            <a href="#"
                                                className={'uppercase'}
                                            >{'Invite Leader'}</a>
                                        </div>
                                    </td> : null}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

AdminTeamsTable.propTypes = {
    teams: React.PropTypes.array,
    project: React.PropTypes.object,
    actionable: React.PropTypes.bool,
};
