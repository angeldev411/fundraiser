/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as constants from '../../common/constants';
import { connect } from 'react-redux';
import { pushPath } from 'redux-simple-router';
import * as TeamActions from '../../redux/team/actions';
import * as Actions from '../../redux/user/actions';

/* Then React components */
import Page from '../../components/Page';
import Cover from '../../components/Cover';
import SignupForm from '../../components/SignupForm';

class TeamSignup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            team: {
                name: 'Some team',
            },
        };
    }

    componentWillMount() {
        document.title = `Signup for ${this.state.team.name} | Raiserve`;
        if (this.props.user) {
            this.props.dispatch(
                pushPath(`/${this.props.params.projectSlug}/${this.props.params.teamSlug}`)
            );
        }
        TeamActions.getTeam(
            this.props.params.projectSlug,
            this.props.params.teamSlug,
        )(this.props.dispatch);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            this.props.dispatch(
                pushPath(`/${this.props.params.projectSlug}/${this.props.params.teamSlug}`)
            );
        } else if (nextProps.error) {
            this.setState({
                error: nextProps.error,
            });
        }
        if (nextProps.team) {
            this.setState({
                team: nextProps.team,
            });
        } else if (nextProps.teamError) {
            this.props.dispatch(pushPath('teamNotFound'));
        }
    }

    submit = (data) => {
        data.teamSlug = this.props.params.teamSlug;

        Actions.signup(data)(this.props.dispatch);
    };

    render() {
        return (
            <Page noHeader={true}
                bodyBackground={{ backgroundColor: 'black' }}
            >
                <Cover
                    image={
                        this.state.team.coverImage ?
                        `${constants.TEAM_IMAGES_FOLDER}/${this.state.team.id}/${this.state.team.coverImage}` :
                        null
                    }
                    customclass={"cover-signup"}
                    tagline={this.state.team.tagline}
                    logo={
                        this.state.team.logo ?
                        `${constants.TEAM_IMAGES_FOLDER}/${this.state.team.id}/${this.state.team.logo}` :
                        null
                    }
                />
                <div className={"main-content"}>
                    <div className={"container"}>
                        <SignupForm onSubmit={this.submit} />
                    </div>
                </div>
            </Page>
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    error: reduxState.main.auth.user,
    team: reduxState.main.team.team,
    teamError: reduxState.main.team.error,
}))(TeamSignup);
