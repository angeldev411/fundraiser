/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as constants from '../../common/constants';

/* Then React components */
import Page from '../../components/Page';
import Cover from '../../components/Cover';
import SignupForm from '../../components/SignupForm';

// TODO dynamic data
import * as data from '../../common/test-data';
const team = data.team;

export default class TeamSignup extends Component {

    componentWillMount() {
        document.title = `Signup for ${team.name} | Raiserve`;
    }

    render() {
        return (
            <Page noHeader={true}
                bodyBackground={{ backgroundColor: 'black' }}
            >
                <Cover image={`${constants.TEAM_IMAGES_FOLDER}/${team.uniqid}/${team.coverImage}`}
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
