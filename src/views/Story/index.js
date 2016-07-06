/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../components/Page';
import SimpleLayout from '../../components/SimpleLayout';

export default class Story extends Component {
    componentWillMount() {
        document.title = 'Our Story | raiserve';
    }

    render() {
        return (
            <Page>
                <div className={"container main-content no-cover"}>
                    <SimpleLayout page={'story'}>
                        <h1>{'Our Story'}</h1>
                        <section>
                            <p>
                                {'About a year ago, we I were talking about the amazing work the nonprofits that we volunteered for were doing. The passion and commitment that the nonprofit leaders and their volunteers had for their respective missions was inspiring. However, like most nonprofits, these organizations really struggled with their resources. They had limited supplies, manpower and financial means, and their fundraising strategies were disconnected from their purpose: holding bake sales instead of working in the classroom, conducting raffles instead of serving food in a soup kitchen. They were taking time and effort away from the impact they could be making in their communities.'}
                            </p>

                            <p>
                                {'This is when the lightbulb went off! Could we flip the model on its head? Could there be a way for nonprofit volunteers to fulfill their organizations’ mission, while simultaneously raising money? What if volunteers simply raised funds by getting sponsored for each hour of service they completed? If volunteers could leverage their social networks to get sponsored for their volunteer efforts, and the money raised went straight to the nonprofits. Volunteers and organizations could accomplish two goals simultaneously. No longer would fundraising and volunteering be separate efforts. No longer would they need to choose between time spent on fundraising and time spent on their mission. Together, the volunteers and their sponsors would make twice the difference! In other words, fewer bake sales, more community impact.'}
                            </p>

                            <p>
                                {'We launched raiserve to unify two challenges: raising money and serving the community. By providing a framework that is user-friendly for nonprofits, volunteers and donors alike, we have made volunteering and fundraising a seamless process. We welcome everyone to start making twice the difference today!'}
                            </p>

                            <p>
                                {'Ryall Carroll and Joel Weingarten'}
                                <br/>
                                <a href={'mailto:ryall@raiserve.org'}>{'ryall@raiserve.org'}</a>
                                <br/>
                                <a href={'mailto:joel@raiserve.org'}>{'joel@raiserve.org'}</a>
                            </p>
                        </section>
                    </SimpleLayout>
                </div>
            </Page>
        );
    }
}
