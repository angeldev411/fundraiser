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
                            <h2>{'raiserve Basics'}</h2>
                            <p>
                                {'raiserve was founded on the premise that there has to be a better way to fundraise.'}
                            </p>
                            <p>
                                {'Our unique platform allows nonprofits, NGO’s, school and universities and their volunteers to raise money by getting sponsored for each hour of service they complete. Donations go directly to the nonprofit and together the volunteers and their sponsors make twice the difference.'}
                            </p>
                        </section>
                        <section>
                            <h2>{'How It Works'}</h2>
                            <p>
                                {'Getting started on our platform is both simple and elegant.'}
                            </p>
                            <p>
                                {'Nonprofits work with the raiserve team to set up their fundraising campaign.'}
                                <br/>
                                {'Volunteers are invited to sign up and customize their personal fundraising page.'}
                                <br/>
                                {'Volunteers share their pages and get sponsored for each hour of service they complete.'}
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
                                {'Volunteers are inspired and motivated to continue volunteering knowing that they are making a double impact on a cause they are passionate about.'}
                                <br/>
                                {'Sponsors know that their dollars are going twice as far, thanks to the volunteer hours they are encouraging. '}
                            </p>
                            <p>
                                {'If you work for or with a nonprofit that would like to use our platform, please contact us at'} <a href="mailto:info@raiserve.org">{'info@raiserve.org'}</a>
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
