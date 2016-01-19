import React, { Component } from 'react';

export default class Aside extends Component {
    render() {
        return (
            <aside className={'col-xs-12 col-lg-4'}>
                <section>
                    <span className={'title'}>{'I Volunteer My Time'}</span>
                    <p>
                        {'I’ve made a pledge to perform service to help our community and raise money for nynyb.'}
                    </p>
                </section>
                <span className={'green-symbol'}>
                    +
                </span>
                <section>
                    <span className={'title'}>{'You Sponsor My Time'}</span>
                    <p>
                        {'You sponsor me for every service hour I volunteer. Your 100% tax deductible contribution goes directly to nynyb.'}
                    </p>
                </section>
                <span className={'green-symbol'}>
                    =
                </span>
                <section>
                    <span className={'title'}>{'Together We Make Twice the Difference'}</span>
                    <p>
                        {'You sponsor me for every service hour I volunteer. Your 100% tax deductible contribution goes directly to nynyb.'}
                    </p>
                </section>
            </aside>
        )
    }
}
