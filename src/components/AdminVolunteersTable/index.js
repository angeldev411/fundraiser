import React, { Component } from 'react';
import Button from '../Button';
import * as constants from '../../common/constants';

export default class AdminVolunteersTable extends Component {
    render() {
        return (
            <div className="table-responsive">
                {this.props.actionable ?
                    <div className={'actions'}>
                        <div className="dropdown">
                            <span>
                                {'Actions'} <i className="fa fa-chevron-down"></i>
                            </span>
                            <ul className="dropdown-content">
                                <li>
                                    <Button customClass="btn-link">{'Email'}</Button>
                                </li>
                            </ul>
                        </div>
                    </div> : null
                }
                <table className="volunteers table">
                    <thead>
                        <tr>
                            <th>{'Member'}</th>
                            <th>{'Email'}</th>
                            <th>{'Hours'}</th>
                            <th>{'Sponsors'}</th>
                            <th>{'$ Raised'}</th>
                            <th>{'$/Hr'}</th>
                            {this.props.actionable ?
                                <th>
                                    <input
                                        type="checkbox"
                                        name={'check-all'}
                                        id={'check-all'}
                                    />
                                </th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.volunteers.map((volunteer, i) => (
                            <tr key={i}>
                                <td className="volunteer-name"><img src={`${constants.USER_IMAGES_FOLDER}/${volunteer.uniqid}/${volunteer.image}`}/>{volunteer.name}</td>
                                <td className="volunteer-email">{volunteer.email}</td>
                                <td>{volunteer.hours}</td>
                                <td>{volunteer.sponsors}</td>
                                <td>{volunteer.raised}</td>
                                <td>{volunteer.hourPledge}</td>
                                {this.props.actionable ?
                                    <td>
                                        <input
                                            type="checkbox"
                                            name={volunteer.uniqid}
                                            id={i}
                                        />
                                    </td> : null}
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
    actionable: React.PropTypes.bool,
};
