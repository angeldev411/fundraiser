import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';

export default class SignupForm extends Component {
    constructor(props) {
        super(props);

        this.state = {};
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
            });
            return;
        }
        if (this.state.email && this.state.password1) {
            this.setState({ error: null });
            this.props.onSubmit({
                email: this.state.email,
                password: this.state.password1,
            });
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
                {this.state.error ? (<p>{this.state.error}</p>) : null}
                <Button type={'submit'} customClass="btn-green-white">{'Submit'}</Button>
            </Form>
        );
    }
}

SignupForm.propTypes = {
    onSubmit: React.PropTypes.func,
};
