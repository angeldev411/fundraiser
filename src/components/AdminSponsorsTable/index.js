import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
// import CollapsableLine from '../CollapsableLine';
// import ChildrenLine from '../ChildrenLine';

export default class AdminSponsorsTable extends Component {
 
  nameFormat(name, sponsor){
    return (
      <a href={`mailto:${sponsor.email}`}>{name}</a>
    );
  }

  render() {
    // transoform the sponsors into an array
    const sponsorshipInfo = this.props.sponsors.reduce(
      (memo, sponsor) => memo.concat(
          // of all of their pledges
          sponsor.pledges
          // with each pledge combined with details
          // about the team or volunteer sponsored
          .map(p => Object.assign(p.sponsored, p.support, {sponsor}))
      ), [])
      // now let's structure sponsorships for easy use in our table
      .map( s => ({
        // borrow the sponsorship token as a unique key
        // all sponsorships should have tokens, but some older ones, maybe not...
        id: s.token || Math.random().toString(),
        name: `${s.sponsor.firstName} ${s.sponsor.lastName}`,
        email: s.sponsor.email, 
        type: s.amount ? 'One Time' : 'Hourly',
        amount: s.amount ? `$${s.amount}` : `$${s.hourly}/hr`,
        total: '$' + s.total.toFixed(2),
        sponsoring: s.firstName ? `${s.firstName} ${s.lastName}` : 'Team'
      }));

    return (
      <BootstrapTable data={sponsorshipInfo}
        className="sponsors table"
        striped={true}
        hover={true}
        search={true}
        pagination={true}
      >
        <TableHeaderColumn dataField="id" isKey={true} hidden={true} dataSort={true}>ID</TableHeaderColumn>
        <TableHeaderColumn width='225' dataField="name" dataSort={true} dataFormat={this.nameFormat}>Name</TableHeaderColumn>
        <TableHeaderColumn dataField="email" hidden={true}>Email</TableHeaderColumn>
        <TableHeaderColumn dataField="amount" dataAlign="center" dataSort={true}>Amount</TableHeaderColumn>
        <TableHeaderColumn dataField="total" dataAlign="center" dataSort={true}>Total to Date</TableHeaderColumn>
        <TableHeaderColumn dataField="type" dataAlign="center" dataSort={true}>Type</TableHeaderColumn>
        <TableHeaderColumn width='225' dataField="sponsoring" dataSort={true}>Sponsoring</TableHeaderColumn>
      </BootstrapTable>
      );
  }
}

AdminSponsorsTable.propTypes = {
  sponsors: React.PropTypes.array
};
