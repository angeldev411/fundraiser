/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as constants from '../../common/constants';
import { connect } from 'react-redux';
import { pushPath } from 'redux-simple-router';
import * as ProjectActions from '../../redux/project/actions';
import * as Actions from '../../redux/user/actions';
import RouteNotFound from '../RouteNotFound';

/* Then React components */
import Page from '../../components/Page';
import SignupForm from '../../components/SignupForm';

class ProjectSignup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {
                name: 'Some project',
            },
        };
    }

    componentWillMount() {
        document.title = `Signup for ${this.state.project.name} | Raiserve`;
        if (this.props.user) {
            this.props.dispatch(
                pushPath(`/${this.props.params.projectSlug}/${this.props.params.projectSlug}`)
            );
        }
        ProjectActions.getProject(
            this.props.params.projectSlug,
        )(this.props.dispatch);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            window.location = '/dashboard';
            // TODO redirect to dashboard
        } else if (nextProps.error) {
            this.setState({
                error: nextProps.error,
            });
        }
        if (nextProps.project) {
            this.setState({
                project: nextProps.project,
            });

            document.title = `Signup for ${nextProps.project.name} | Raiserve`;
        } else if (nextProps.projectError) {
            this.setState({
                projectError: true,
            });
        }
    }

    submit = (data) => {
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
    project: reduxState.main.project.project,
    projectError: reduxState.main.project.error,
}))(ProjectSignup);
