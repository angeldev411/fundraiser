/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../components/Page';
import Button from '../../components/Button';
import { Link } from 'react-router';
import * as Urls from '../../urls.js';

export default class Home extends Component {
    componentWillMount() {
        document.title = 'You + Us = A World of Change | Raiserve';
    }

    render() {
        return (
            <Page>
                <div className={"container main-content no-cover"}>
                    <div className={'home col-xs-12'}>
                        <h1>{'You + Us = A World of Change'}</h1>
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
                        <Button customClass="btn-contact btn-transparent-green">
                            {'Contact US'}
                        </Button>
                        <div className={'links'}>
                            <Link
                                to={Urls.RAISERVE_BASICS}
                                target="_blank"
                            >
                                {'See How it Works'}
                            </Link>
                        </div>
                    </div>
                </div>
            </Page>
        );
    }
}

Home.propTypes = {
    show: React.PropTypes.bool,
};
