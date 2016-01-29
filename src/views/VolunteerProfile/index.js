/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { Link } from 'react-router';
import * as constants from '../../common/constants';

/* Then React components */
import Page from '../../components/Page';
import Cover from '../../components/Cover';
import Layout34 from '../../components/Layout34';
import UserList from '../../components/UserList';

// TODO dynamic volunteer
const volunteer = {
    name: 'Heather Miller',
    uniqid: 'samples',
    image: 'user.jpg',
    hours: 240,
    message: 'Personal Message Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. tecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
    team: {
        name: 'Habitat for Humanity',
        uniqid : 'samples',
        slug: 'example',
        logo: 'team_logo.png',
        coverImage : 'team_cover.jpg',
        tagline: 'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        slogan: 'LOVE + HELP = MONEY FOR THE HOMELESS',
        description: 'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat',
    }
};

export default class VolunteerProfile extends Component {
    componentWillMount() {
        document.title = `${volunteer.name} | Raiserve`;
    }

    render() {
        return (
            <Page>
                <Cover image={`url(${constants.TEAM_IMAGES_FOLDER}/${volunteer.team.uniqid}/${volunteer.team.coverImage})`}
                    customclass={"cover-volunteer-profile"}
                    tagline={volunteer.team.tagline}
                    button={"Sponsor Now"}
                    volunteer={volunteer}
                />
                <div className={"main-content"}>
                    <div className={"container"}>
                        <Layout34 page={'teamprofile'}>
                            <img id="team-logo"
                                src={`${constants.TEAM_IMAGES_FOLDER}/${volunteer.team.uniqid}/${volunteer.team.logo}`}
                                title=""
                            />
                            <h1>{volunteer.team.name}</h1>
                            <p>
                                {volunteer.team.description}
                            </p>
                        </Layout34>
                    </div>
                </div>
            </Page>
        );
    }
}

VolunteerProfile.propTypes = {
    show: React.PropTypes.bool,
    volunteer: React.PropTypes.object,
};
