/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as constants from '../../common/constants';
import { connect } from 'react-redux';
import * as Actions from '../../redux/team/actions';
import { pushPath } from 'redux-simple-router';

/* Then React components */
import Page from '../../components/Page';
import Cover from '../../components/Cover';
import TeamProfileBlock from '../../components/TeamProfileBlock';
import UserList from '../../components/UserList';

// TODO dynamic data
import * as data from '../../common/test-data';
const team = data.team;

class TeamProfile extends Component {
    componentWillMount() {
        document.title = `${team.name} | Raiserve`;
        Actions.getTeam(
            this.props.params.projectSlug,
            this.props.params.teamSlug,
        )(this.props.dispatch);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.team) {
            this.setState({
                team: nextProps.team,
            });
        } else if (nextProps.error) {
            this.props.dispatch(pushPath('/teamNotFound'));
        }
    }

    render() {
        const SHARE_URL = `${constants.DOMAIN}${this.props.location.pathname}`;
        const SHARE_TEXT = `${team.name} - Raiserve`;
        const SHARE_MESSAGE = `${team.slogan}`;

        // TODO check if user has rights
        const editable = window.location.search.substring(1) === 'edit';

        return (
            <Page>
                <Cover image={`${constants.TEAM_IMAGES_FOLDER}/${team.uniqid}/${team.coverImage}`}
                    customclass={"cover-team-profile"}
                    tagline={team.tagline}
                    button={"Sponsor Now"}
                    editable={editable}
                />
                <div className={"main-content"}>
                    <TeamProfileBlock
                        team={team}
                        editable={editable}
                    />
                    <div className="team-profile-footer">
                        <div className={"container"}>
                            <div className="team">
                                <div className={'team-header clearfix'}>
                                    <span className="team-title">{'Our volunteers'}</span>
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
                                <UserList
                                    team={team}
                                    color={"light"}
                                />
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

export default connect((reduxState) => ({
    team: reduxState.main.team.team,
    error: reduxState.main.team.error,
}))(TeamProfile);
