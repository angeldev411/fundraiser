/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as constants from '../../common/constants';
import { connect } from 'react-redux';
import * as Actions from '../../redux/volunteer/actions';
import * as TeamActions from '../../redux/team/actions';
import RouteNotFound from '../RouteNotFound';
import { pushPath } from 'redux-simple-router';
import { Link } from 'react-router';

/* Then React components */
import Page from '../../components/Page';
import Cover from '../../components/Cover';
import TeamProfileBlock from '../../components/TeamProfileBlock';

class VolunteerProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            volunteer: {
                firstName: 'John',
                lastName: 'Doe',
            },
            team: {
                name: 'Unknown name',
                tagline: 'Default Tagline',
            },
        };
    }
    componentWillMount() {
        TeamActions.getTeam(
            this.props.params.projectSlug,
            this.props.params.teamSlug,
        )(this.props.dispatch);
        Actions.getVolunteer(this.props.params.volunteerSlug)(this.props.dispatch);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.volunteer) {
            this.setState({
                volunteer: nextProps.volunteer,
            });
        } else if (nextProps.error) {
            return (<RouteNotFound />);
        }
        if (nextProps.user) {
            this.setState({
                user: nextProps.user,
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
        document.title = `${this.state.volunteer.firstName} ${this.state.volunteer.lastName} | Raiserve`;
        return (
            <Page
                greenHeader={(this.state.volunteer && this.state.user && this.state.volunteer.id === this.state.user.id) ? 'volunteer' : null}
                project={this.state.user ? this.state.user.project : null}
                team={this.state.team}
            >
                <Cover image={`${constants.TEAM_IMAGES_FOLDER}/${this.state.team.id}/${this.state.team.coverImage}`}
                    customclass={"cover-volunteer-profile"}
                    tagline={this.state.team.tagline}
                    button={"Sponsor Now"}
                    team={this.state.team}
                    volunteer={this.state.volunteer}
                    pathname={this.props.location.pathname}
                />
                <div className={"main-content"}>
                    <TeamProfileBlock
                        team={this.state.team}
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
    team: reduxState.main.team.team,
    user: reduxState.main.auth.user,
    error: reduxState.main.volunteer.error,
    teamError: reduxState.main.team.error,
}))(VolunteerProfile);
