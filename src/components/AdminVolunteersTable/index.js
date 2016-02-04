import React, { Component } from 'react';
import * as constants from '../../common/constants';

export default class AdminVolunteersTable extends Component {
    render() {
        return (
            <div className="table-responsive">
                <table className="volunteers table">
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Email</th>
                            <th>Hours</th>
                            <th>Sponsors</th>
                            <th>$ Raised</th>
                            <th>$/Hr</th>
                            {this.props.editable ? <th>Actions</th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.volunteers.map((volunteer, i) => (
                            <tr key={i}>
                                <td className="volunteer-name"><img src={`${constants.USER_IMAGES_FOLDER}/${volunteer.uniqid}/${volunteer.image}`}/>{volunteer.name}</td>
                                <td>{volunteer.email}</td>
                                <td>{volunteer.hours}</td>
                                <td>{volunteer.sponsors}</td>
                                <td>{volunteer.raised}</td>
                                <td>{volunteer.hourPledge}</td>
                                {this.props.editable ? <td>{'Actions'}</td> : null}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

AdminVolunteersTable.propTypes = {
    volunteers: React.PropTypes.array,
    editable: React.PropTypes.bool,
};
