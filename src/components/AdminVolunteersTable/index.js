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
                                <td className="volunteer-name">
                                    {volunteer.image ?
                                        <img src={`${constants.USER_IMAGES_FOLDER}/${volunteer.id}/${volunteer.image}`}/>
                                    :
                                        <img src={`${constants.USER_IMAGES_FOLDER}/${constants.DEFAULT_AVATAR}`}/>
                                    }
                                    {`${volunteer.firstName} ${volunteer.lastName}`}
                                </td>
                                <td className="volunteer-email">{volunteer.email}</td>
                                <td>{volunteer.hours ? volunteer.hours : 0}</td>
                                <td>{volunteer.sponsors ? volunteer.sponsors : 0}</td>
                                <td>{volunteer.raised ? volunteer.raised : 0}</td>
                                <td>{volunteer.hourPledge ? volunteer.hourPledge : 0}</td>
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
