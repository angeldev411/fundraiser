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
                                    {sponsor.pledges.map((pledge, x) => (
                                        <ChildrenLine key={x}>
                                            <span className="label uppercase">{'Hourly: '}</span> {`$${pledge.support.hourly}/hr`}
                                            <span className="label uppercase">{'$ CAP: '}</span> {pledge.support.cap ? `$${pledge.support.cap}` : 'None'}
                                            <span className="label uppercase">{'Total: '}</span> <span className="green">{`$${pledge.support.total}`}</span>
                                            <span>
                                            {!this.props.isVolunteer ? (
                                                <span>
                                                    <span className="label uppercase">{pledge.sponsored.firstName ? 'Member: ' : 'Team: '}</span>
                                                    {pledge.sponsored.firstName ? `${pledge.sponsored.firstName} ${pledge.sponsored.lastName}` : pledge.sponsored.name}
                                                </span>
                                            ) : null}
                                            </span>
                                            <span className="label uppercase">{'Date: '}</span> <span>{`${new Date(pledge.support.date).toLocaleDateString()}`}</span>
                                        </ChildrenLine>
                                    ))}
                                </ul>
                            }
                        >
                            <div className="sponsor-details">
                                <span className="label uppercase">{'Sponsor: '}</span> {sponsor.firstName} {sponsor.lastName}
                                <span className="label uppercase">{'Email: '}</span> {sponsor.email}
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
