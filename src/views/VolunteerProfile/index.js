/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as constants from '../../common/constants';
import { connect } from 'react-redux';
import * as Actions from '../../redux/volunteer/actions';
import * as TeamActions from '../../redux/team/actions';
import * as ProjectActions from '../../redux/project/actions';
import RouteNotFound from '../RouteNotFound';

/* Then React components */
import Page from '../../components/Page';
import Cover from '../../components/Cover';
import TeamProfileBlock from '../../components/TeamProfileBlock';

class VolunteerProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            volunteer: {
                firstName: '',
                lastName: '',
            },
            team: {
                name: '',
                tagline: '',
                deadline: ''
            },
            project: {
                name: '',
            },
        };
    }
    buttonText(){
        return this.state.volunteer.firstName;
    }
    componentWillMount() {
        TeamActions
          .getTeam( this.props.params.projectSlug, this.props.params.teamSlug )
          (this.props.dispatch);

        ProjectActions
          .getProject( this.props.params.projectSlug )
          (this.props.dispatch);

        Actions
          .getVolunteer(this.props.params.volunteerSlug)
          (this.props.dispatch);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.volunteer) {
            this.setState({
                volunteer: nextProps.volunteer,
            });
        } else if (nextProps.error) {
            this.setState({
                volunteer: null,
            });
        }
        if (nextProps.user) {
            this.setState({
                user: nextProps.user,
            });
        }
        if (nextProps.project) {
            this.setState({
                project: nextProps.project,
            });
        }
        if (nextProps.team) {
            this.setState({
                team: nextProps.team,
            });
        } else if (nextProps.teamError) {
            return (<RouteNotFound />);
        }
    }

    render() {
        if (this.state.volunteer === null) {
            return (<RouteNotFound />);
        }

        if (!this.props.project || !this.props.team || !this.props.volunteer) {
            return null;
        }

        document.title = `${this.state.volunteer.firstName} ${this.state.volunteer.lastName} | raiserve`;
        return (
            <Page
                greenHeader={(this.state.volunteer && this.state.user && this.state.volunteer.id === this.state.user.id) ? 'volunteer' : null}
                project={this.state.user ? this.state.user.project : null}
                team={this.state.team}
            >
                <Cover image={
                        this.state.team.coverImage ?
                        `${this.state.team.coverImage}` :
                        null
                    }
                    customclass={"cover-volunteer-profile"}
                    tagline={this.state.team.tagline}
                    button={`Sponsor ${this.buttonText()}`}
                    team={this.state.team}
                    project={this.state.project}
                    volunteer={this.state.volunteer}
                    totalVolunteerSponsors={this.state.volunteer.totalSponsors}
                    pathname={this.props.location.pathname}
                />
                <div className={"main-content"}>
                    <TeamProfileBlock
                        team={this.state.team}
                        project={this.state.project}
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

export default connect((reduxState) => ({
    volunteer: reduxState.main.volunteer.volunteer,
    project: reduxState.main.project.project,
    team: reduxState.main.team.team,
    user: reduxState.main.auth.user,
    error: reduxState.main.volunteer.error,
    teamError: reduxState.main.team.error,
}))(VolunteerProfile);
