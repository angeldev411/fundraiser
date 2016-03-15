import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';

export default class SignupForm extends Component {
    constructor(props) {
        super(props);

        const inviteCode = this.getParam('c');
        const email = this.getParam('m');

        if (inviteCode && email) {
            this.state = {
                inviteCode,
                email,
                loading: false,
            };
        } else {
            this.state = {
                loading: false,
            };
        }
    }

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    submit = () => {
        this.setState({
            loading: true,
        });
        if (this.state.password1 !== this.state.password2) {
            this.setState({
                error: `Passwords don't match`,
                loading: false,
            });
            return;
        }
        if (this.state.email && this.state.password1) {
            this.setState({ error: null });
            this.props.onSubmit({
                email: this.state.email,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                password: this.state.password1,
                inviteCode: this.state.inviteCode,
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
            <Form id="signup"
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                title={'Sign Up'}
                description="Isicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
                onSubmit={this.submit}
            >
                <div className="form-group">
                    {
                        (this.state.inviteCode && this.state.email)
                        ? <input type="email"
                            name="email"
                            id="email"
                            value={this.state.email}
                            disabled
                          />
                        : <input type="email"
                            name="email"
                            id="email"
                            onChange={(e) => { this.handleChange(e, 'email') }}
                          />
                    }
                    <label htmlFor="email">{'Email address'}</label>
                </div>

                <div className="form-group">
                    <input type="text"
                        name="firstName"
                        id="firstName"
                        onChange={(e) => { this.handleChange(e, 'firstName') }}
                    />
                    <label htmlFor="firstName">{'Firstname'}</label>
                </div>

                <div className="form-group">
                    <input type="text"
                        name="lastName"
                        id="lastName"
                        onChange={(e) => { this.handleChange(e, 'lastName') }}
                    />
                    <label htmlFor="lastName">{'Lastname'}</label>
                </div>

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
                    disabled={this.props.loading ? this.props.loading : this.state.loading}
                >{'Submit'}</Button>
            </Form>
        );
    }
}

SignupForm.propTypes = {
    onSubmit: React.PropTypes.func,
    error: React.PropTypes.string,
    loading: React.PropTypes.boolean,
};
