/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../components/Page';
import Button from '../../components/Button';
import { Link } from 'react-router';
import * as Urls from '../../urls.js';

export default class Home extends Component {
    componentWillMount() {
        document.title = 'Volunteers + Sponsors = Twice the Difference | Raiserve';
    }

    render() {
        return (
            <Page>
                <div className={"container main-content no-cover"}>
                    <div className={'home col-xs-12'}>
                        <h1>{'Volunteers'} <br className={'visible-xs'} /> {'+'} <br className={'visible-xs'} /> {'Sponsors'} <br className={'visible-xs'} /> {'='} <br className={'visible-xs'} /> {'Twice the'} <br className={'visible-xs'} /> {'Difference'}</h1>
                        <p>
                            {'It’s simple really, people volunteer all the time to make an impact on the world around them.'}<br/>
                            {'Those same people raise money for their favorite charities. But what if they could do both?'}<br/>
                            {'What of they could raise money for the hours they volunteer? With raiserve now they can.'}
                        </p>
                        <p>
                            {'Beautiful people volunteer their time for your organization.'}<br/>
                            {'Other giving individuals and companies sponsor those hours.'}<br/>
                            <span className={'bold'}>{'Together we help your organization make twice the difference.'}</span>
                        </p>
                        <a
                            className="btn btn-contact btn-transparent-green"
                            href={'mailto:contact@raiserve.org'}
                        >
                            {'Contact US'}
                        </a>
                    </div>
                </div>
            </Page>
        );
    }
}

Home.propTypes = {
    show: React.PropTypes.bool,
};
