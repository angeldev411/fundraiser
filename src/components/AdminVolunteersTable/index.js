import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Link } from 'react-router';

import _ from 'lodash';

import * as constants from '../../common/constants';
import * as Urls from '../../urls.js';

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

        const userIsAdminOrLeader = this.props.user && 
          _.intersection(this.props.user.roles,['SUPER_ADMN', 'TEAM_LEADER']).length > 0;
        
        const memberFormat = (email, member) => {

          return (
            <div className="volunteer-name row">
              <div className="col-md-4">
              { member.image ? (
                <img src={`${constants.RESIZE_PROFILE}${member.image}`}/>
              ) : (
                <img src={`${constants.USER_IMAGES_FOLDER}/${constants.DEFAULT_AVATAR}`}/>
              )}
              </div>

              <div className="col-md-8">
                <div>{member.firstName} {member.lastName}</div>
                
                { userIsAdminOrLeader ? (
                  <a href={`/api/v1/auth/switch/${member.email}`}><i className="fa fa-user-secret"></i></a>
                ) : (
                  null
                )}
                
                <a href={`mailto:${member.email}`}><i className="fa fa-envelope"></i></a>
              </div>
            </div>
          );
        }

        const priceFormatter = (price) => {
          return '<i class="glyphicon glyphicon-usd"></i> ' + price.toFixed(2);
        }

        return (
            <div className="volunteers-table">
              <BootstrapTable data={this.props.volunteers} 
                className="volunteers table"
                striped={true} 
                hover={true} 
                search={true}
                pagination={true}
              >
                  <TableHeaderColumn dataField="email" isKey={true} dataAlign="left" dataSort={true} dataFormat={memberFormat}>Member</TableHeaderColumn>
                  <TableHeaderColumn dataField="firstName" hidden={true}>First Name</TableHeaderColumn>
                  <TableHeaderColumn dataField="lastName" hidden={true}>Last Name</TableHeaderColumn>
                  <TableHeaderColumn dataField="totalSponsors" dataAlign="center" dataSort={true}>Sponsors</TableHeaderColumn>
                  <TableHeaderColumn dataField="totalHours" dataAlign="center" dataSort={true} dataFormat={(v)=>v.toFixed(2)}>Hours</TableHeaderColumn>
                  <TableHeaderColumn dataField="hourlyPledge" dataAlign="center" dataFormat={priceFormatter}>Hourly Pledge</TableHeaderColumn>
                  <TableHeaderColumn dataField="raised" dataAlign="center" dataFormat={priceFormatter}>$ Raised</TableHeaderColumn>
              </BootstrapTable>
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
