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
                                            <div className={'col-xs-12'}>
                                                <div className={'col-xs-4'}>
                                                    {pledge.support.hourly ?
                                                            (<div>
                                                                <div className={'col-xs-6'}>
                                                                    <span className="label uppercase">{'Hourly: '}</span> {`$${pledge.support.hourly}`}
                                                                </div>
                                                                <div className={'col-xs-6'}>
                                                                    <span className="label uppercase">{'Total: '}</span> <span className="green">{`$${pledge.support.total}`}</span>
                                                                </div>
                                                            </div>
                                                            ) :
                                                            (<div className={'col-xs-12'}>
                                                                <span className="label uppercase">{'Donated: '}</span> {`$${pledge.support.amount}`}
                                                            </div>)
                                                    }
                                                </div>
                                                <div className={'col-xs-5'}>
                                                    <span>
                                                    {!this.props.isVolunteer ? (
                                                        <span>
                                                            <span className="label uppercase">{pledge.sponsored.firstName ? 'Member: ' : 'Entire Team: '}</span>
                                                            {pledge.sponsored.firstName ? `${pledge.sponsored.firstName} ${pledge.sponsored.lastName}` : pledge.sponsored.name}
                                                        </span>
                                                    ) : null}
                                                    </span>
                                                </div>
                                                <div className={'col-xs-3'}>
                                                    <span className="label uppercase">{'Date: '}</span> <span>{`${new Date(pledge.support.date).toDateString()}`}</span>
                                                </div>
                                            </div>
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
