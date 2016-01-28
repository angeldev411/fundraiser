/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../components/Page';
import SimpleLayout from '../../components/SimpleLayout';

export default class Story extends Component {
    componentWillMount() {
        document.title = 'Our Story | Raiserve';
    }

    render() {
        return (
            <Page>
                <div className={"container main-content no-cover"}>
                    <SimpleLayout page={'story'}>
                        <h2>{'Our Story'}</h2>
                        <section>
                            <p>
                                {'About a year ago Joel and I were talking about the amazing work the nonprofits we volunteered with were doing. The passion and commitment the nonprofit, and the people volunteering for the nonprofit, had for their causes was inspiring. However, like most nonprofits, these organizations really struggled with their resources. They had limited supplies, manpower and financial means. To make matters worse the limited manpower they had was not doing the amazing work they wanted to be doing in the local community, but instead were dedicated to raising money. Instead of volunteering in the classroom they were doing bake sales, instead of working in a soup kitchen they were running a 5k, etc.'}
                            </p>

                            <p>
                                {'This is when the lightbulb went off! Why not develop a way for people to do the amazing work in local community while simultaneously raising money to support these nonprofits? Why not simply have volunteers raise money by getting sponsorship for each hour of service they complete? Donations would go directly to the nonprofits and together the volunteers and their sponsors would make twice the difference. Now individuals could make a difference in the local community by volunteering in the classroom or working in a soup kitchen while simultaneously raising money. No longer would the fundraising efforts be misaligned with the nonprofit’s mission.'}
                            </p>

                            <p>
                                {'We started raiserve because we realized there had to be a better raise to fundraise.'}
                                <br/>
                                {'We are proud that our vision has been realized through this platform and welcome everyone to start making twice the difference.'}
                            </p>

                            <p>
                                {'Ryall Carroll and Joel Weingarten'}
                                <br/>
                                {'co-founders raiserve'}
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
