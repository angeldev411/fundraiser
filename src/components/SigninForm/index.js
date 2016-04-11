import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Form from '../../components/Form';
import * as Actions from '../../redux/auth/actions';
import * as UserActions from '../../redux/user/actions';

class SigninForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            resetPassword: false,
            passwordResetRequested: false,
            remember: false,
        };
    }

    componentDidMount() {
        UserActions.resetRedux()(this.props.dispatch);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.signInError) {
            this.setState({
                error: nextProps.signInError,
                loading: false,
            });
        } else if (nextProps.user) {
            this.setState(
                {
                    user: nextProps.user,
                    error: null,
                }
            );
        } else if (nextProps.reset) {
            this.setState(
                {
                    resetPassword: false,
                    passwordResetRequested: true,
                    error: null,
                    loading: false,
                }
            );
        } else if (nextProps.resetError) {
            this.setState(
                {
                    loading: false,
                    error: nextProps.resetError,
                }
            );
        }
    }

    signIn = () => {
        this.setState({
            loading: true,
        });
        Actions.signIn(
            this.state.email,
            this.state.password,
            this.state.remember,
        )(this.props.dispatch);
    };

    requestPassword = () => {
        this.setState({
            loading: true,
        });
        UserActions.requestPasswordReset(
            { email: this.state.email },
        )(this.props.dispatch);
    };

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    handleResetPassword = () => {
        this.setState({
            resetPassword: true,
        });
    };

    handleRememberMe = (event) => {
        const newState = Object.assign({}, this.state);

        newState.remember = event.nativeEvent.target.checked;

        this.setState(newState);
    };

    render() {
        if (!this.state.error && this.state.passwordResetRequested) {
            return (
                <h2>{'You should receive a reset password email shortly.'}</h2>
            );
        } else if (this.state.resetPassword) {
            return (
                <Form title={'Reset password'}
                    cols={"col-xs-12 col-md-8 col-md-offset-2"}
                    onSubmit={this.requestPassword}
                >
                    <div className="form-group">
                        <input type="email"
                            name="email"
                            id="email"
                            onChange={(e) => { this.handleChange(e, 'email') }}
                        />
                        <label htmlFor="email">{'Email address'}</label>
                    </div>

                    {this.state.error ? <p>{this.state.error}</p> : null}
                    <Button
                        customClass="btn-green-white"
                        type={'submit'}
                        disabled={this.state.loading}
                    >
                        {'Confirm'}
                    </Button>
                </Form>
            );
        }

        return (
            <Form title={'Sign In'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                description="Isicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
                onSubmit={this.signIn}
            >
                <div className="form-group">
                    <input type="email"
                        name="email"
                        id="email"
                        onChange={(e) => { this.handleChange(e, 'email') }}
                    />
                    <label htmlFor="email">{'Email address'}</label>
                </div>

                <div className="form-group">
                    <input type="password"
                        name="password"
                        id="password"
                        onChange={(e) => { this.handleChange(e, 'password') }}
                    />
                    <label htmlFor="password">{'Password'}</label>
                </div>
                <div className="form-group remember-checkbox">
                    <label>
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            onChange={(e) => { this.handleRememberMe(e) }}
                        />
                        <span className="remember-label">{'Remember me'}</span>
                    </label>
                </div>
                {this.state.error ? <p>{this.state.error}</p> : null}
                <Button
                    customClass="btn-green-white"
                    type={'submit'}
                    disabled={this.state.loading}
                >
                    {'Sign In'}
                </Button>
                <Button
                    customClass="btn-link password-forgotten"
                    onClick={this.handleResetPassword}
                >
                    {'Reset password'}
                </Button>
            </Form>
        );
    }
}

export default connect((reduxState) => ({
    signInError: reduxState.main.auth.signInError,
    user: reduxState.main.auth.user,
    reset: reduxState.main.user.reset,
    resetError: reduxState.main.user.resetError,
}))(SigninForm);
