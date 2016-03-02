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

class TeamProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            team: {
                tagline: 'YOU + US = A WORLD OF CHANGE',
                slogan: 'Your Team slogan here',
                description: 'Put your description here',
            },
        };
    }

    componentWillMount() {
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
        document.title = `${this.state.team.name} | Raiserve`;
        const SHARE_URL = `${constants.DOMAIN}${this.props.location.pathname}`;
        const SHARE_TEXT = `${this.state.team.name} - Raiserve`;
        const SHARE_MESSAGE = `${this.state.team.slogan}`;

        const editable = window.location.search.substring(1) === 'edit';

        return (
            <Page>
                <Cover
                    image={
                        this.state.team.coverImage ?
                        `${constants.TEAM_IMAGES_FOLDER}/${this.state.team.id}/${this.state.team.coverImage}` :
                        null
                    }
                    customclass={"cover-team-profile"}
                    tagline={this.state.team.tagline}
                    button={"Sponsor Now"}
                    editable={editable}
                    team={this.state.team}
                />
                <div className={"main-content"}>
                    <TeamProfileBlock
                        team={this.state.team}
                        editable={editable}
                    />
                    <div className="team-profile-footer">
                        <div className={"container"}>
                            <div className="team">
                                <div className={'team-header clearfix'}>
                                    {
                                        this.state.team.users ?
                                        (<span className="team-title">{'Our volunteers'}</span>) :
                                        null
                                    }
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
                                    team={this.state.team}
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
