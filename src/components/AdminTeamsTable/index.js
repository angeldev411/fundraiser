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

    handleSort = (column) => {
        this.props.onSort(column);
    };

    render() {
        console.log(this.props.user);
        return (
            <div className="table-responsive">
                <table className="teams table">
                    <thead>
                        <tr>
                            <th
                                onClick={() => {
                                    this.handleSort('name')
                                }}
                            >{'Team Name'}</th>
                            <th
                                onClick={() => {
                                    this.handleSort('raised')
                                }}
                            >{'Total $'}</th>
                            <th
                                onClick={() => {
                                    this.handleSort('totalHours')
                                }}
                            >{'Total hours'}</th>
                            <th
                                onClick={() => {
                                    this.handleSort('totalVolunteers')
                                }}
                            >{'# Volunteers'}</th>
                            {this.props.actionable ? <th>{'Actions'}</th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.teams.map((team, i) => (
                            <tr key={i}>
                                <td className={'team-name'}>
                                    {(
                                        this.props.user
                                        && this.props.user.roles.indexOf('PROJECT_LEADER') >= 0
                                        && team.fakeLeaderId
                                    ) ?
                                        <a className={'nostyle'} href={`/api/v1/auth/switch/${team.fakeLeaderId}`}>{team.name}</a> :
                                        <span>{team.name}</span>
                                    }
                                </td>
                                <td>{team.raised ? team.raised : 0}</td>
                                <td>{team.totalHours ? team.totalHours : 0}</td>
                                <td>{team.totalVolunteers ? team.totalVolunteers : 0}</td>
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
    onSort: React.PropTypes.func,
    user: React.PropTypes.object,
};
