import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Form from '../../components/Form';
import * as Actions from '../../redux/auth/actions';

class SigninForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.signInError) {
            this.setState({ error: nextProps.signInError });
        } else if (nextProps.user) {
            this.setState(
                {
                    user: nextProps.user,
                    error: null,
                }
            );
        }
        console.log('setstate');
        this.setState({
            loading: false,
        });
    }

    signIn = () => {
        this.setState({
            loading: true,
        });
        Actions.signIn(
            this.state.email,
            this.state.password
        )(this.props.dispatch);
    };

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    render() {
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
                {this.state.error ? <p>{this.state.error}</p> : null}
                <Button
                    customClass="btn-green-white"
                    type={'submit'}
                    disabled={this.state.loading}
                >
                    {'Sign In'}
                </Button>
            </Form>
        );
    }
}

export default connect((reduxState) => ({
    signInError: reduxState.main.auth.signInError,
    user: reduxState.main.auth.user,
}))(SigninForm);
