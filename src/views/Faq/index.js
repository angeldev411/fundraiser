/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../components/Page';
import SimpleLayout from '../../components/SimpleLayout';

export default class Faq extends Component {
    componentWillMount() {
        document.title = 'Frequently Asked Questions | Raiserve';
    }

    render() {
        return (
            <Page>
                <div className={"container main-content no-cover"}>
                    <SimpleLayout page={'faq'}>
                        <h1>{'Frequently Asked Questions'}</h1>
                        <section>
                            <h2>{'Q: Is my donation secure?'}</h2>
                            <p>
                                {'A: YES. We use industry­standard SSL (secure socket layer) technology to protect your information and provide a safe and secure environment for online donations. We will not sell, trade or share your personal information with anyone else, nor send donor mailings on behalf of other organizations.'}
                            </p>

                            <h2>{'Q: Is my donation tax deductible?'}</h2>
                            <p>
                                {'A: Yes, 100% tax deductible! Your donation is going to a 501(c)3 tax­exempt organization and your donation is tax­deductible within the guidelines of U.S. law. No goods or services were provided in consideration for your contribution. You will get a receipt via email shortly after the campaign is finished.'}
                            </p>

                            <h2>{'Q: Do I get a receipt?'}</h2>
                            <p>
                                {'A: A donation receipt will be sent to you at the email address you provide on your sponsorship form. Please be sure to keep a copy of your receipt for tax purposes. If you select a recurring donation, you will be sent an individual receipt each month when your donation is processed.'}
                            </p>

                            <h2>{'Q: When will I be charged if I gave an hourly sponsorship?'}</h2>
                            <p>
                                {'A: If you are sponsoring monthly your credit card that you provided will be charged monthly for all hours completed that month up to the number of goal hours assuming a minimum charge of $5. If the minimum is not reached that amount will be rolled in the next month. If service hours have already been completed, those hours will be included in your first month of sponsorship.'}
                            </p>

                            <h2>{'Q: When will I be charged if I gave a one time donations?'}</h2>
                            <p>
                                {'A: Your credit card is charged right away.'}
                            </p>

                            <h2>{'Q: How will I pay?'}</h2>
                            <p>
                                {'A: By credit card­ Secure payment is powered by Stripe. We use industry­standard SSL (secure socket layer) technology to protect your information and provide a safe and secure environment for online donations. We will not sell, trade or share your personal information with anyone else, nor send donor mailings on behalf of other organizations.'}
                            </p>

                            <h2>{'Q: How can I see how many hours someone has volunteered'}</h2>
                            <p>
                                {'A: You can follow an individual or the chapters sponsorship pages'}
                            </p>

                            <h2>{'Q: How do I update my credit card information?'}</h2>
                            <p>
                                {'A: You can email us at questions@raiserve.org or call or text us at 804­-537-­2473.'}
                            </p>

                            <h2>{'Q: I want to change the amount pledged, how do I do that?'}</h2>
                            <p>
                                {'A: You can email us at questions@raiserve.org or call or text us at 804­-537-­2473.'}
                            </p>

                            <h2>{'Q: How do I contact Raiserve'}</h2>
                            <p>
                                {'A: You can email us at questions@raiserve.org or call or text us at 804­-537-­2473.'}
                            </p>
                        </section>
                    </SimpleLayout>
                </div>
            </Page>
        );
    }
}
