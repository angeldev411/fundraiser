import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import * as constants from '../../common/constants';
import * as Urls from '../../urls.js';

import { Link } from 'react-router';

import AdminTeamEmailForm from '../AdminTeamEmailForm';
import Button from '../Button';
import ModalButton from '../ModalButton';
import classNames from 'classnames';


export default class AdminVolunteersTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            linesChecked: [],
            checked: false,
            showDropdown: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.volunteers) {
            const lines = [];

            for (let i = 0; i < nextProps.volunteers.length; i++) {
                lines[i] = false;
                if (i === nextProps.volunteers.length - 1) {
                    this.setState({
                        linesChecked: lines,
                    });
                }
            }
        }
        if (nextProps.user) {
            this.setState({
                user: nextProps.user,
            });
        }
    }

    handleCheck(i) {
        const lines = this.state.linesChecked;

        lines[i] = !lines[i];
        this.setState({
            linesChecked: lines,
        });
    }

    handleCheckAll() {
        const lines = this.state.linesChecked;

        for (let i = 0; i < lines.length; i++) {
            lines[i] = !this.state.checked;

            if (i === lines.length - 1) {
                this.setState({
                    linesChecked: lines,
                });
            }
        }
        this.setState({
            checked: !this.state.checked,
        });
    }

    handleUnlink = () => {
        const selectedVolunteers = [];

        for (let i = 0; i < this.state.linesChecked.length; i++) {
            if (this.state.linesChecked[i]) {
                selectedVolunteers.push(this.props.volunteers[i]);
            }
        }

        this.props.onUnlink(selectedVolunteers);
    };

    lockDropdown = () => {
        this.setState({
            showDropdown: !this.state.showDropdown,
        });
    };

    handleSort = (column) => {
        this.props.onSort(column);
    };

    render() {
        const selectedVolunteers = [];

        for (let i = 0; i < this.state.linesChecked.length; i++) {
            if (this.state.linesChecked[i]) {
                selectedVolunteers.push(this.props.volunteers[i]);
            }
        }

        const priceFormatter = (cell, row) => {
          return '<i class="glyphicon glyphicon-usd"></i> ' + cell.toFixed(2);
        }

        return (
            // new table here
            <div>
            <BootstrapTable data={this.props.volunteers} striped={true} hover={true}>
                <TableHeaderColumn dataField="email" isKey={true} dataSort={true}>Email</TableHeaderColumn>
                <TableHeaderColumn dataField="totalHours" dataSort={true} dataFormat={priceFormatter}>Hours</TableHeaderColumn>
                <TableHeaderColumn dataField="raised" dataFormat={priceFormatter}>$ Raised</TableHeaderColumn>
                <TableHeaderColumn dataField="hourlyPledge" dataFormat={priceFormatter}>Hourly Pledge</TableHeaderColumn>
            </BootstrapTable>

            <div className="table-responsive">
                {this.props.actionable ?
                    <div className={'actions'}>
                        <div className="dropdown">
                            <span>
                                {'Actions'} <i className="fa fa-chevron-down"></i>
                            </span>
                            <ul className={
                                    classNames({
                                        'dropdown-content__active': this.state.showDropdown,
                                    }, 'dropdown-content')
                                }
                            >
                                <li>
                                    <ModalButton
                                        customClass="btn-link"
                                        content={
                                            <AdminTeamEmailForm
                                                project={this.props.user.project}
                                                team={this.props.user.team}
                                                recipients={selectedVolunteers}
                                            />
                                        }
                                        onModalToggle={this.lockDropdown}
                                    >
                                        {'Email'}
                                    </ModalButton>
                                    <Button
                                        customClass="btn-link"
                                        onClick={this.handleUnlink}
                                    >
                                        {'Remove'}
                                    </Button>
                                </li>
                            </ul>
                        </div>
                    </div> : null
                }
                <table className="volunteers table">
                    <thead>
                        <tr>
                            <th
                                onClick={() => {
                                    this.handleSort('firstName')
                                }}
                            >
                                {'Member'}
                            </th>
                            <th
                                onClick={() => {
                                    this.handleSort('email')
                                }}
                            >
                                {'Email'}
                            </th>
                            <th
                                onClick={() => {
                                    this.handleSort('totalHours')
                                }}
                            >
                                {'Hours'}
                            </th>
                            <th
                                onClick={() => {
                                    this.handleSort('totalSponsors')
                                }}
                            >
                                {'Sponsors'}
                            </th>
                            <th
                                onClick={() => {
                                    this.handleSort('raised')
                                }}
                            >
                                {'$ Raised'}
                            </th>
                            <th
                                onClick={() => {
                                    this.handleSort('hourlyPledge')
                                }}
                            >
                                {'$/Hr'}
                            </th>
                            {this.props.actionable ?
                                <th>
                                    <input
                                        type="checkbox"
                                        name={'check-all'}
                                        id={'check-all'}
                                        onChange={() => {
                                            this.handleCheckAll();
                                        }}
                                    />
                                </th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.volunteers.map((volunteer, i) => {
                            return (<tr key={i}>
                                <td className="volunteer-name">
                                    {volunteer.image ?
                                        <img src={`${constants.RESIZE_PROFILE}${volunteer.image}`}/>
                                    :
                                        <img src={`${constants.USER_IMAGES_FOLDER}/${constants.DEFAULT_AVATAR}`}/>
                                    }

                                    {(
                                        this.props.user
                                        && (
                                            this.props.user.roles.indexOf('SUPER_ADMIN') >= 0
                                            || this.props.user.roles.indexOf('TEAM_LEADER') >= 0
                                        )
                                    ) ?
                                        <a href={`/api/v1/auth/switch/${volunteer.email}`}>{`${volunteer.firstName} ${volunteer.lastName}`}</a> :
                                        <span>{`${volunteer.firstName} ${volunteer.lastName}`}</span>
                                    }

                                </td>
                                <td className="volunteer-email">
                                    <a href={`mailto:${volunteer.email}`}>{volunteer.email}</a>
                                </td>
                                <td>{volunteer.totalHours ? volunteer.totalHours : 0}</td>
                                <td>{volunteer.totalSponsors ? volunteer.totalSponsors : 0}</td>
                                <td>{'$'}{volunteer.raised ? volunteer.raised : 0}</td>
                                <td>{'$'}{volunteer.hourlyPledge ? volunteer.hourlyPledge : 0}</td>
                                {this.props.actionable ?
                                    (<td>
                                        <input
                                            type="checkbox"
                                            name={volunteer.uniqid}
                                            id={i}
                                            onChange={() => {
                                                this.handleCheck(i);
                                            }}
                                            checked={this.state.linesChecked[i]}
                                        />
                                    </td>) : null}
                            </tr>);
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        );
    }
}

AdminVolunteersTable.propTypes = {
    volunteers: React.PropTypes.array,
    user: React.PropTypes.object,
    actionable: React.PropTypes.bool,
    onUnlink: React.PropTypes.func,
    onSort: React.PropTypes.func,
};
