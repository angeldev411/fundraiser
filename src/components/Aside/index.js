import React, { Component } from 'react';

export default class Aside extends Component {
    render() {
        return (
            <aside className={'col-xs-12 col-lg-4 col-lg-pull-8'}>
                <section>
                    <h2 className={'title'}>{'I Volunteer My Time'}</h2>
                    <p>
                        {`I’ve made a pledge to perform service to help our community and raise money for ${this.props.team ? this.props.team.name : `the team`}.`}
                    </p>
                </section>
                <span className={'green-symbol'}>
                    +
                </span>
                <section>
                    <h2 className={'title'}>{'You Sponsor My Time'}</h2>
                    <p>
                        {`You sponsor me for every service hour I volunteer. Your 100% tax deductible contribution goes directly to ${this.props.team ? this.props.team.name : `the team`}.`}
                    </p>
                </section>
                <span className={'green-symbol'}>
                    =
                </span>
                <section>
                    <h2 className={'title'}>{'Together We Make Twice the Difference'}</h2>
                    <p>
                        {`You sponsor me for every service hour I volunteer. Your 100% tax deductible contribution goes directly to ${this.props.team ? this.props.team.name : `the team`}.`}
                    </p>
                </section>
            </aside>
        )
    }
}

Aside.propTypes = {
    project: React.PropTypes.object,
    team: React.PropTypes.object,
};
