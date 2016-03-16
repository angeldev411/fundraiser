/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushPath } from 'redux-simple-router';
import * as TeamActions from '../../redux/team/actions';
import * as Actions from '../../redux/user/actions';
import * as Urls from '../../urls';
import RouteNotFound from '../RouteNotFound';

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
            loading: false,
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
            if (nextProps.user.roles.indexOf('VOLUNTEER') >= 0) {
                window.location = `${Urls.ADMIN_VOLUNTEER_PROFILE_URL}`;
            } else {
                window.location = `${Urls.REDIRECT_TO_DASHBOARD}`;
            }

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
            this.setState({
                teamError: true,
            });
        }
        this.setState({
            loading: false,
        });
    }

    submit = (data) => {
        this.setState({
            loading: true,
        });
        data.teamSlug = this.props.params.teamSlug;

        Actions.signup(data)(this.props.dispatch);
    };

    render() {
        if (this.state.projectError) {
            return (<RouteNotFound />);
        }

        return (
            <Page noHeader={true}
                bodyBackground={{ backgroundColor: 'black' }}
            >
                <Cover
                    image={
                        this.state.team.coverImage ?
                        `${this.state.team.coverImage}` :
                        null
                    }
                    customclass={"cover-signup"}
                    tagline={this.state.team.tagline}
                    logo={
                        this.state.team.logo ?
                        `${this.state.team.logo}` :
                        null
                    }
                />
                <div className={"main-content"}>
                    <div className={"container"}>
                        <SignupForm
                            onSubmit={this.submit}
                            error={this.state.error ? this.state.error : ''}
                            loading={this.state.loading}
                        />
                    </div>
                </div>
            </Page>
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    error: reduxState.main.user.error,
    team: reduxState.main.team.team,
    teamError: reduxState.main.team.error,
}))(TeamSignup);
