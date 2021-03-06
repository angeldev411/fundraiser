/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as constants from '../../common/constants';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
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
            loading: false,
        };
    }

    componentWillMount() {
        document.title = `Signup for ${this.state.project.name} | raiserve`;
        if (this.props.user) {
            this.props.dispatch(
                push(`/${this.props.params.projectSlug}/${this.props.params.projectSlug}`)
            );
        }
        ProjectActions.getProject(
            this.props.params.projectSlug,
        )(this.props.dispatch);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            window.location = '/dashboard';
        } else if (nextProps.error) {
            this.setState({
                error: nextProps.error,
                loading: false,
            });
        }
        if (nextProps.project) {
            this.setState({
                project: nextProps.project,
                loading: false,
            });

            document.title = `Signup for ${nextProps.project.name} | raiserve`;
        } else if (nextProps.projectError) {
            this.setState({
                projectError: true,
                loading: false,
            });
        }
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
    project: reduxState.main.project.project,
    projectError: reduxState.main.project.error,
}))(ProjectSignup);
