/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../components/Page';
import Layout34 from '../../components/Layout34';

export default class RaiserveBasics extends Component {
    componentWillMount() {
        document.title = 'Raiserve Basics | Raiserve';
    }

    render() {
        return (
            <Page>
                <div className={"container main-content no-cover"}>
                    <Layout34 page={'raiserve-basics'}>
                        <h1>{'VOLUNTEERS + SPONSORS'}<br/>{'= TWICE THE DIFFERENCE'}</h1>
                        <section>
                            <h2>{'Raiserve Basics'}</h2>
                            <p>
                                {'Raiserve was founded on the premise that there has to be a better way to fundraise.'}
                            </p>
                            <p>
                                {'Our unique platform allows Nonprofits, NGO’s, School and Universities and their volunteers to raise money by getting sponsorship for each hour of service they complete. Donations go directly to the Non-profit and together the volunteers and their sponsors make twice the difference.'}
                            </p>
                        </section>
                        <section>
                            <h2>{'How It Works'}</h2>
                            <p>
                                {'Getting started on our platform is both simple and elegant.'}
                            </p>
                            <p>
                                {'Nonprofits work with the Raiserve team to set up their fundraising campaign.'}
                                <br/>
                                {'Volunteers are invited to sign up and customize their personal fundraising page.'}
                                <br/>
                                {'Volunteers share their page and get sponsored for each hour of service they complete.'}
                                <br/>
                                {'Volunteers record their service hours and their sponsors donate each month based on the amount they have volunteered.'}
                            </p>
                        </section>
                        <section>
                            <h2>{'Why It Works'}</h2>
                            <p>
                                {'Sponsoring hours of service is a great way to raise money.'}
                            </p>
                            <p>
                                {'Volunteers are inspired and motivated to continue volunteer knowing that they are simultaneously raising money for a cause they are passionate about.'}
                                <br/>
                                {'Sponsors feel better about themselves and the organization they are donating to with the knowledge that they are supporting a great organization and inspiring volunteers.'}
                            </p>
                            <p>
                                {'If you work for or with a Non-profit that would like to use our platform please contact us at'} <a href="mailto:info@raiserve.org">{'info@raiserve.org'}</a>
                            </p>
                        </section>
                    </Layout34>
                </div>
            </Page>
        );
    }
}

RaiserveBasics.propTypes = {
    show: React.PropTypes.bool,
};
