import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';

export default class AdminTeamEmailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    submit = () => {
        console.log(this.state.subject, this.state.body);
        // Actions.sendEmail(
        //     this.state.subject,
        //     this.state.body,
        // )(this.props.dispatch);
    };

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    render() {
        return (
            <Form title={'Email Your Team Members'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                id={"email-team-form"}
                description={'Have a message to send to your entire team? Use the filed below to make it easy and fluid to ensure all of your team sees the same outreach from you.'}
                onSubmit={this.submit}
            >
                <div className="form-group">
                    <input type="text"
                        name="subject"
                        id="subject"
                        onChange={(e) => { this.handleChange(e, 'subject') }}
                    />
                    <label htmlFor="subject">{'Subject'}</label>
                </div>
                <div className="form-group">
                    <textarea
                        name="body"
                        id="body"
                        rows="5"
                        placeholder={'Type your email message here'}
                        onChange={(e) => { this.handleChange(e, 'body') }}
                    />
                    <label htmlFor="body">{'Message'}</label>
                </div>
                <Button
                    customClass="btn-green-white"
                    type={'submit'}
                >
                    {'Send'}
                </Button>
            </Form>
        );
    }
}
