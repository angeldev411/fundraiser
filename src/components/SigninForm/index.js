import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';

export default class SigninForm extends Component {
    render() {
        return (
            <Form title={'Sign In'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
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

                <Button type="btn-success">{'Sign In'}</Button>
            </Form>
        );
    }
}
