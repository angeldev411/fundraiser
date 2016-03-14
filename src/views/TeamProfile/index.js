/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as constants from '../../common/constants';
import { connect } from 'react-redux';
import * as ActionsTeam from '../../redux/team/actions';
import * as ActionsVolunteer from '../../redux/volunteer/actions';

/* Then React components */
import Page from '../../components/Page';
import Cover from '../../components/Cover';
import TeamProfileBlock from '../../components/TeamProfileBlock';
import UserList from '../../components/UserList';
import RouteNotFound from '../RouteNotFound';

class TeamProfile extends Component {
    constructor(props) {
        super(props);

        this.defaultTeam = {
            tagline: 'Put your Team tagline here',
            slogan: 'PUT YOUR TEAM SLOGAN HERE',
            description: 'Put your description here',
        };

        this.state = {
            team: this.defaultTeam,
            volunteers: [],
        };
    }

    componentWillMount() {
        ActionsTeam.getTeam(
            this.props.params.projectSlug,
            this.props.params.teamSlug,
        )(this.props.dispatch);
        ActionsVolunteer.getVolunteers(
            this.props.params.projectSlug,
            this.props.params.teamSlug,
        )(this.props.dispatch);
        ActionsVolunteer.getVolunteers(
            this.props.params.projectSlug,
            this.props.params.teamSlug,
        )(this.props.dispatch);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.team) {
            this.setState({
                team: {
                    ...this.defaultTeam,
                    ...nextProps.team,
                },
            });
        }
        if (nextProps.volunteers) {
            this.setState({
                volunteers: nextProps.volunteers,
            });
        }
        if (nextProps.user) {
            this.setState({
                user: nextProps.user,
            });
        }
        if (nextProps.error) {
            this.setState({ team: null });
        }
    }

    render() {
        if (this.state.team === null) {
            return (<RouteNotFound />);
        }

        document.title = `${this.state.team.name} | Raiserve`;
        const SHARE_URL = `${constants.DOMAIN}${this.props.location.pathname}`;
        const SHARE_TEXT = `${this.state.team.name} - Raiserve`;
        const SHARE_MESSAGE = `${this.state.team.slogan}`;

        let header = null;

        if (this.state.team && this.state.user && this.state.user.team) {
            if (this.state.team.id === this.state.user.team.id) {
                header = 'team';
            }
        }

        console.log(this.state);

        const editable = window.location.search.substring(1) === 'edit';

        return (
            <Page greenHeader={header}>
                <Cover
                    image={
                        this.state.team.coverImage ?
                        `${this.state.team.coverImage}` :
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
                                        this.state.volunteers ?
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
                                    volunteers={this.state.volunteers}
                                    teamSlug={this.props.params.teamSlug}
                                    projectSlug={this.props.params.projectSlug}
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
    volunteers: reduxState.main.volunteer.volunteers,
    user: reduxState.main.auth.user,
    error: reduxState.main.team.error,
}))(TeamProfile);
