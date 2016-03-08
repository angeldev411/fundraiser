import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Form from '../../components/Form';
import * as Actions from '../../redux/email/actions';

class AdminTeamEmailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    submit = () => {
        Actions.sendEmail(
            this.props.user.project.slug,
            this.props.user.team.slug,
            this.state.subject,
            this.state.message,
        )(this.props.dispatch);
    };

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.hasOwnProperty('error')) {
            this.setState({ error: nextProps.error });
        }
        if (nextProps.user) {
            this.setState(
                {
                    user: nextProps.user,
                }
            );
        }
        if (nextProps.email) {
            this.setState(
                {
                    email: nextProps.email,
                    error: null,
                }
            );
        }
    }

    render() {
        return (
            <Form title={'Email Your Team Members'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                id={"email-team-form"}
                description={'Have a message to send to your entire team? Use the filed below to make it easy and fluid to ensure all of your team sees the same outreach from you.'}
                onSubmit={this.submit}
            >
                {this.props.recipients ? (
                    <div className="form-group">
                        <input type="text"
                            name="recipients"
                            id="recipients"
                            disabled
                        />
                        <label htmlFor="recipients">{'Recipients'}</label>
                    </div>
                ) : null}
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
                        name="message"
                        id="message"
                        rows="5"
                        placeholder={'Type your email message here'}
                        onChange={(e) => { this.handleChange(e, 'message') }}
                    />
                    <label htmlFor="message">{'Message'}</label>
                </div>

                {this.state.error ? <p>{this.state.error}</p> : null}
                {this.state.email
                    ? <p>{'Your message has been sent.'}</p>
                    : <Button
                        customClass="btn-green-white"
                        type={'submit'}
                      >
                        {'Send'}
                    </Button>
                }
            </Form>
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    error: reduxState.main.email.error,
    email: reduxState.main.email.email,
}))(AdminTeamEmailForm);
