/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as constants from '../../common/constants';

/* Then React components */
import Page from '../../components/Page';
import Cover from '../../components/Cover';
import TeamProfileBlock from '../../components/TeamProfileBlock';
import UserList from '../../components/UserList';

// TODO dynamic data
import * as data from '../../common/test-data';
const team = data.team;

export default class TeamProfile extends Component {
    componentWillMount() {
        document.title = `${team.name} | Raiserve`;
    }

    render() {
        const SHARE_URL = `${constants.DOMAIN}${this.props.location.pathname}`;
        const SHARE_TEXT = `${team.name} - Raiserve`;
        const SHARE_MESSAGE = `${team.slogan}`;

        return (
            <Page>
                <Cover image={`url(${constants.TEAM_IMAGES_FOLDER}/${team.uniqid}/${team.coverImage})`}
                    customclass={"cover-team-profile"}
                    tagline={team.tagline}
                    button={"Sponsor Now"}
                />
                <div className={"main-content"}>
                    <TeamProfileBlock team={team}/>
                    <div className="team-profile-footer">
                        <div className={"container"}>
                            <div className="team">
                                <div className={'team-header clearfix'}>
                                    <span className="team-title">{'Team of volunteers'}</span>
                                    <span className="team-share">{'Share our goal'}</span>
                                    <span>
                                        <a href={`mailto:?subject=${SHARE_TEXT}&body=${SHARE_MESSAGE} - ${SHARE_URL}`}>
                                            <i className="fa fa-envelope"/>
                                        </a>
                                        <a href={`https://www.facebook.com/sharer.php?u=${SHARE_URL}`}
                                            target="_blank"
                                        >
                                            <i className="fa fa-facebook"/>
                                        </a>
                                        <a href={`https://twitter.com/share?url=${SHARE_URL}&text=${SHARE_TEXT}&via=${constants.TWITTER_USERNAME}`}
                                            target="_blank"
                                        >
                                            <i className="fa fa-twitter"/>
                                        </a>
                                    </span>
                                </div>
                                <UserList team={team}/>
                            </div>
                        </div>
                    </div>
                </div>
            </Page>
        );
    }
}

TeamProfile.propTypes = {
    show: React.PropTypes.bool,
};
