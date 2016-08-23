import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {Link} from 'react-router';

import _ from 'lodash';

import * as constants from '../../common/constants';
import * as Urls from '../../urls.js';

import AdminTeamEmailForm from '../AdminTeamEmailForm';
import Button from '../Button';
import ModalButton from '../ModalButton';
import classNames from 'classnames';


export default class AdminVolunteersTable extends Component {

  constructor(){
    super();

    this.memberFormat = this.memberFormat.bind(this);
  }

  memberFormat(email, member){

    const userIsAdminOrLeader = this.props.user && 
          _.intersection(this.props.user.roles,['SUPER_ADMN', 'TEAM_LEADER']).length > 0;

    return (
        <div className="volunteer name row">
            <div className="col-md-2">
            { member.image ? (
            <img src={`${constants.RESIZE_PROFILE}${member.image}`}/>
            ) : (
            <img src={`${constants.USER_IMAGES_FOLDER}/${constants.DEFAULT_AVATAR}`}/>
            )}
            </div>

            <div className="col-md-10" style={{paddingLeft:'20px'}}>
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

  priceFormat(price){
    return '<i class="glyphicon glyphicon-usd"></i> ' + price.toFixed(2);
  }            

    // TODO: Re-implement removing/unlinking volunteers
    // handleUnlink = () => {
    //     const selectedVolunteers = [];

    //     for (let i = 0; i < this.state.linesChecked.length; i++) {
    //         if (this.state.linesChecked[i]) {
    //             selectedVolunteers.push(this.props.volunteers[i]);
    //         }
    //     }

    //     this.props.onUnlink(selectedVolunteers);
    // };

  render() {

    return (
            <div className="volunteers-table">
              <BootstrapTable data={this.props.volunteers} 
                className="volunteers table"
                striped={true} 
                hover={true} 
                search={true}
                pagination={true}
              >
                  <TableHeaderColumn width={'270'} dataField="lastName" isKey={true} dataAlign="left" dataSort={true} dataFormat={this.memberFormat}>Member</TableHeaderColumn>
                  <TableHeaderColumn dataField="firstName" hidden={true}>First Name</TableHeaderColumn>
                  <TableHeaderColumn dataField="email" hidden={true}>Last Name</TableHeaderColumn>
                  <TableHeaderColumn width={'105'} dataField="totalSponsors" dataAlign="center" dataSort={true}>Sponsors</TableHeaderColumn>
                  <TableHeaderColumn width={'95'} dataField="totalHours" dataAlign="center" dataSort={true} dataFormat={(v)=>v.toFixed(2)}>Hours</TableHeaderColumn>
                  <TableHeaderColumn dataField="hourlyPledge" dataAlign="center" dataFormat={this.priceFormat}>Hourly Pledge</TableHeaderColumn>
                  <TableHeaderColumn dataField="raised" dataAlign="center" dataFormat={this.priceFormat}>$ Raised</TableHeaderColumn>
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
