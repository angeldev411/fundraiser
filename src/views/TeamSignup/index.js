/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as constants from '../../common/constants';

/* Then React components */
import Page from '../../components/Page';
import Cover from '../../components/Cover';
import SignupForm from '../../components/SignupForm';

export default class TeamSignup extends Component {
    componentWillMount() {
        document.title = 'Signup for TeamProfileNameHere | Raiserve';
    }

    render() {
        // TODO dynamic team
        const team = {
            name: 'Habitat for Humanity',
            uniqid : 'samples',
            slug: 'example',
            logo: 'team_logo.png',
            coverImage : 'team_cover.jpg',
            tagline: 'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            slogan: 'LOVE + HELP = MONEY FOR THE HOMELESS',
            description: 'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat',
        };

        return (
            <Page noHeader={true}
                bodyBackground={{ backgroundColor: 'black' }}
            >
                <Cover image={`url(${constants.TEAM_IMAGES_FOLDER}/${team.uniqid}/${team.coverImage})`}
                    customclass={"cover-signup"}
                    tagline={team.tagline}
                    logo={`${constants.TEAM_IMAGES_FOLDER}/${team.uniqid}/${team.logo}`}
                />
                <div className={"main-content"}>
                    <div className={"container"}>
                        <SignupForm/>
                    </div>
                </div>
            </Page>
        );
    }
}
