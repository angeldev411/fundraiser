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
import SocialShareLinks from '../../components/SocialShareLinks';

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
                name: ''
            },
        };
    }

    addSponsor() {
      this.setState({
        totalSponsors: ++this.state.totalSponsors
      });
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
                totalSponsors: nextProps.team.totalSponsors
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

    buttonText(){
        return this.state.team.name;
    }

    render() {
        if (this.state.team === null) {
            return (<RouteNotFound />);
        }

        let header = null;

        if (this.state.team && this.state.user && this.state.user.team) {
            if (this.state.team.id === this.state.user.team.id) {
                header = 'team';
            }
        }

        document.title = `${this.state.team.name} | raiserve`;

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
                    button={`Sponsor ${this.buttonText()}`}
                    onPledgeSuccess={this.addSponsor.bind(this)}
                    editable={editable}
                    team={this.state.team}
                    project={this.state.project}
                />
                <div className={"main-content"}>
                    <TeamProfileBlock
                        team={this.state.team}
                        totalSponsors={this.state.totalSponsors}
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
                                    <span className="team-share">{'Please share our page'}</span>
                                    <SocialShareLinks
                                      project={this.state.project}
                                      team={this.state.team}
                                    />
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
