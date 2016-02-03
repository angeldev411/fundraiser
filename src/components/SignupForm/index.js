import React, { Component } from 'react';
import Button from '../../components/Button';

export default class SignupForm extends Component {
    render() {
        return (
            <div id="signup"
                className="form-container col-xs-12 col-md-6 col-md-offset-3"
            >
                <h2 className={'uppercase'}>{'Sign Up'}</h2>
                <p>{'isicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'}</p>
                <form>
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

                    <Button type="btn-success">{'Submit'}</Button>
                </form>
            </div>
        );
    }
}
