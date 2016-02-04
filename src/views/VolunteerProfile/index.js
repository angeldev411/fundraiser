/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as constants from '../../common/constants';

/* Then React components */
import Page from '../../components/Page';
import Cover from '../../components/Cover';
import TeamProfileBlock from '../../components/TeamProfileBlock';

// TODO dynamic data
import * as data from '../../common/test-data';
const volunteer = data.volunteer;

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
                    pathname={this.props.location.pathname}
                />
                <div className={"main-content"}>
                    <TeamProfileBlock team={volunteer.team}
                        volunteerprofile={true}
                    />
                </div>
            </Page>
        );
    }
}

VolunteerProfile.propTypes = {
    show: React.PropTypes.bool,
    volunteer: React.PropTypes.object,
    location: React.PropTypes.object,
};
