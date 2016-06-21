/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as constants from '../../common/constants';
import { connect } from 'react-redux';
import * as ActionsTeam from '../../redux/team/actions';
import * as ActionsVolunteer from '../../redux/volunteer/actions';
import * as ActionsProject from '../../redux/project/actions';

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
            tagline: 'Put your team tagline here',
            slogan: 'Twice the Difference',
            description: 'Put your team description here',
            name: ''
        };

        this.state = {
            team: this.defaultTeam,
            volunteers: [],
            project: {
                name: '',
            },
        };
    }

    componentWillMount() {
        ActionsTeam.getTeam(
            this.props.params.projectSlug,
            this.props.params.teamSlug,
        )(this.props.dispatch);

        ActionsProject.getProject(
            this.props.params.projectSlug,
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
        if (nextProps.project) {
            this.setState({
                project: nextProps.project,
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

        document.title = `${this.state.team.name} | raiserve`;
        const SHARE_URL = `${constants.DOMAIN}${this.props.location.pathname}`;
        const TWITTER_MESSAGE = `Sponsor ${this.state.team.name} for each hour they volunteer. \
Money goes to ${this.state.project.name}.`;
        const SHARE_MESSAGE = `${this.state.team.slogan}`;

        const EMAIL_SUBJECT = `Sponsor ${this.state.team.name} and Make Twice the Difference`;
        const EMAIL_MESSAGE = `Please help ${this.state.team.name} raise \
money for ${this.state.project.name}.  Sponsor each hour they volunteer \
and make twice the difference.%0D%0A
%0D%0A
%0D%0A
http://${SHARE_URL}%0D%0A
%0D%0A
${this.state.team.description}` ;

        let header = null;

        if (this.state.team && this.state.user && this.state.user.team) {
            if (this.state.team.id === this.state.user.team.id) {
                header = 'team';
            }
        }

        const editable = window.location.search.substring(1) === 'edit';

        return (
            <Page
                greenHeader={header}
                project={this.state.user ? this.state.user.project : null}
                team={this.state.team}
            >
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
                        project={this.state.project}
                        editable={editable}
                        teamgoal={true}
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
                                        <a href={`mailto:?subject=${EMAIL_SUBJECT}&body=${EMAIL_MESSAGE}`}>
                                            <i className="fa fa-envelope"/>
                                        </a>
                                        <a href={`https://www.facebook.com/sharer.php?u=${SHARE_URL}`}
                                            target="_blank"
                                        >
                                            <i className="fa fa-facebook"/>
                                        </a>
                                        <a href={`https://twitter.com/share?url=${SHARE_URL}&text=${TWITTER_MESSAGE}&via=${constants.TWITTER_USERNAME}&hashtags=maketwicethedifference`}
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
    project: reduxState.main.project.project,
    volunteers: reduxState.main.volunteer.volunteers,
    user: reduxState.main.auth.user,
    error: reduxState.main.team.error,
}))(TeamProfile);
