import React, { Component } from 'react';

export default class Aside extends Component {
    render() {
        return (
            <aside className={'col-xs-12 col-lg-4 col-lg-pull-8'}>
                <section>
                    <h2 className={'title'}>{!this.props.volunteerprofile ? 'We Volunteer Our Time' : 'I Volunteer My Time'}</h2>
                    <p>
                        {!this.props.volunteerprofile ?
                            `We've made a pledge to perform service to help our community and raise money for ${this.props.team ? this.props.team.name : `the team`}.` :
                            `I’ve made a pledge to perform service to help our community and raise money for ${this.props.team ? this.props.team.name : `the team`}.`
                        }
                    </p>
                </section>
                <span className={'green-symbol'}>
                    +
                </span>
                <section>
                    <h2 className={'title'}>{!this.props.volunteerprofile ? 'You Sponsor Our Time' : 'You Sponsor My Time'}</h2>
                    <p>
                        {!this.props.volunteerprofile ?
                            `You sponsor us for every service hour we volunteer. Your 100% tax deductible contribution goes directly to ${this.props.team ? this.props.team.name : `the team`}.` :
                            `You sponsor me for every service hour I volunteer. Your 100% tax deductible contribution goes directly to ${this.props.team ? this.props.team.name : `the team`}.`
                        }
                    </p>
                </section>
                <span className={'green-symbol'}>
                    =
                </span>
                <section>
                    <h2 className={'title'}>{'Together We Make Twice the Difference'}</h2>
                    <p>
                        {!this.props.volunteerprofile ?
                            `You sponsor us for every service hour we volunteer. Your 100% tax deductible contribution goes directly to ${this.props.team ? this.props.team.name : `the team`}.` :
                            `You sponsor me for every service hour I volunteer. Your 100% tax deductible contribution goes directly to ${this.props.team ? this.props.team.name : `the team`}.`
                        }
                    </p>
                </section>
            </aside>
        );
    }
}

Aside.propTypes = {
    project: React.PropTypes.object,
    team: React.PropTypes.object,
    volunteerprofile: React.PropTypes.bool,
};
