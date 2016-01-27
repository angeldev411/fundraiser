import React, { Component } from 'react';
import Button from '../../components/Button';

export default class SigninForm extends Component {
    render() {
        return (
            <div id="signin"
                className="form-container col-xs-12 col-md-6 col-md-offset-3"
            >
                <h3>{'Sign In'}</h3>
                <p>{'Isicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'}</p>
                <form id="signin">
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

                    <Button type="btn-success">{'Sign In'}</Button>
                </form>
            </div>
        );
    }
}

SigninForm.propTypes = {

};
