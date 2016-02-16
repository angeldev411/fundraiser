import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';

export default class SignupForm extends Component {
    render() {
        return (
            <Form id="signup"
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                title={'Sign Up'}
                description="Isicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
            >
                <div className="form-group">
                    <input type="email"
                        name="email"
                        id="email"
                    />
                    <label htmlFor="email">{'Email address'}</label>
                </div>

                <div className="form-group">
                    <input type="password"
                        name="password"
                        id="password"
                    />
                    <label htmlFor="password">{'Password'}</label>
                </div>

                <div className="form-group">
                    <input type="password"
                        name="password-confirmation"
                        id="password-confirmation"
                    />
                    <label htmlFor="password-confirmation">{'Password Confirmation'}</label>
                </div>
                <Button customClass="btn-green-white">{'Submit'}</Button>
            </Form>
        );
    }
}
