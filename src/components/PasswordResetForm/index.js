import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';

export default class PasswordResetForm extends Component {
    constructor(props) {
        super(props);

        const resetToken = this.getParam('t');

        if (!resetToken) {
            window.location = '/';
        }

        if (resetToken) {
            this.state = {
                resetToken,
            };
        }
    }

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    submit = () => {
        if (this.state.password1 !== this.state.password2) {
            this.setState({
                error: `Passwords don't match`,
                loading: false,
            });
            return;
        }
        if (this.state.password1) {
            this.setState({
                error: null,
            });
            this.props.onSubmit({
                password: this.state.password1,
                resetToken: this.state.resetToken,
            });
        }
    };

    getParam = (variable) => {
        const query = window.location.search.substring(1);
        const vars = query.split('&');

        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');

            if (pair[0] === variable) {
                return pair[1];
            }
        }
    };

    render() {
        return (
            <Form id="passwordReset"
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                title={'Reset your password'}
                onSubmit={this.submit}
            >
                <div className="form-group">
                    <input type="password"
                        name="password"
                        id="password"
                        onChange={(e) => { this.handleChange(e, 'password1') }}
                    />
                    <label htmlFor="password">{'Password'}</label>
                </div>

                <div className="form-group">
                    <input type="password"
                        name="password-confirmation"
                        id="password-confirmation"
                        onChange={(e) => { this.handleChange(e, 'password2') }}
                    />
                    <label htmlFor="password-confirmation">{'Password Confirmation'}</label>
                </div>
                {this.props.error ? (<p>{this.props.error}</p>) : null}
                {this.state.error ? (<p>{this.state.error}</p>) : null}
                <Button
                    type={'submit'}
                    customClass="btn-green-white"
                    disabled={this.props.loading}
                >{'Submit'}</Button>
            </Form>
        );
    }
}

PasswordResetForm.propTypes = {
    onSubmit: React.PropTypes.func,
    error: React.PropTypes.string,
    loading: React.PropTypes.bool,
};
