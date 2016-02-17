import React, { Component } from 'react';
import CollapsableLine from '../CollapsableLine';
import ChildrenLine from '../ChildrenLine';
import AdminProjectForm from '../AdminProjectForm';
import AdminTeamForm from '../AdminTeamForm';
import ModalButton from '../ModalButton';

export default class AdminSponsorsTable extends Component {
    render() {
        return (
            <div className="sponsors-table">
                <ul className="sponsors">
                    {this.props.sponsors.map((sponsor, i) => (
                        <CollapsableLine key={i}
                            childrenContent={
                                <ul className="children-content clearfix">
                                    {sponsor.donations.map((donation, x) => (
                                        <ChildrenLine key={x}>
                                            <span className="label uppercase">{'Hourly: '}</span> {`$${donation.hourly}/hr`}
                                            <span className="label uppercase">{'$ CAP: '}</span> {donation.cap ? `$${donation.cap}` : 'None'}
                                            <span className="label uppercase">{'Total: '}</span> <span className="green">{`$${donation.total}`}</span>
                                            {!this.props.isVolunteer ?
                                                (<span><span className="label uppercase">{donation.member ? 'Member: ' : 'Team: '}</span> {donation.member ? `${donation.member.firstname} ${donation.member.lastname}` : donation.team.name} </span>)
                                            : null}
                                            <span className="label uppercase">{'Date: '}</span> {donation.date}
                                        </ChildrenLine>
                                    ))}
                                </ul>
                            }
                        >
                            <div className="sponsor-details">
                                <span className="label uppercase">Sponsor: </span> {sponsor.name}
                                <span className="label uppercase">Email: </span> {sponsor.email}
                            </div>
                        </CollapsableLine>
                    ))}
                </ul>
            </div>
        );
    }
}

AdminSponsorsTable.propTypes = {
    sponsors: React.PropTypes.array,
    isVolunteer: React.PropTypes.bool,
};
