import React, { Component } from 'react';
import AdminTeamForm from '../AdminTeamForm';
import ModalButton from '../ModalButton';

export default class AdminTeamsTable extends Component {
    render() {
        return (
            <div className="table-responsive">
                <table className="teams table">
                    <thead>
                        <tr>
                            <th>Team Name</th>
                            <th>$ Raised</th>
                            <th>Hours<br/>volunteered</th>
                            <th>Total<br/>volunteers</th>
                            {this.props.editable ? <th>Actions</th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.project.teams.map((team, i) => (
                            <tr key={i}>
                                <td className={'team-name'}>{team.name}</td>
                                <td>{team.raised}</td>
                                <td>{team.totalHours}</td>
                                <td>{team.totalVolunteers}</td>
                                {this.props.editable ?
                                    <td>
                                        <div className={'edit-links'}>
                                            <ModalButton type="btn-link uppercase"
                                                content={
                                                    <AdminTeamForm title={"Edit team"}
                                                        project={this.props.project}
                                                        team={team}
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
    project: React.PropTypes.object,
    editable: React.PropTypes.bool,
};
