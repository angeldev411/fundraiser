import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import moment from 'moment';

export default class SignupForm extends Component {
    constructor(props) {
        super(props);

        const inviteCode = this.getParam('c');
        const email = this.getParam('m');
        const role = this.getParam('r');

        if (inviteCode && email) {
            this.state = {
                inviteCode,
                email,
                isTeamLead: role === 'TEAM_LEADER',
                loading: false,
            };
        } else {
            this.state = {
                loading: false,
            };
        }
    }

    deadline() {
      return moment( this.props.deadline ).format('MMM D YYYY');
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

        // goal is only required for team members.
        // In that case, we expect to have a deadline and the invite was not for a team leader  
        const deadlineRequired = !!this.props.deadline;
        if (deadlineRequired && !this.state.isTeamLead && 
           (!this.state.goal || this.state.goal <= 0)) {
          return this.setState({ error: 'Please set a goal' });
        }

        if (this.state.email && this.state.password1) {
            this.setState({ error: null });
            this.props.onSubmit({
                email:      this.state.email,
                firstName:  this.state.firstName,
                lastName:   this.state.lastName,
                password:   this.state.password1,
                goal:       this.state.goal,
                inviteCode: this.state.inviteCode,
            });
        } else {
            this.setState({
                error: `Please check the form, all fields are required.`,
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
                description="Tell us a little about yourself to get started."
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

                { !this.state.isTeamLead && this.props.deadline ?
                  <div className="form-group">
                      <input type="number"
                          name="goal"
                          id="goal"
                          onChange={(e) => { this.handleChange(e, 'goal') }}
                      />
                    <label htmlFor="goal">
                      Goal Hours by {this.deadline()}&nbsp;&nbsp;
                      <span className={'lowercase'}>
                        Be conservative, you can always add another goal in the future.
                      </span>
                    </label>
                  </div>
                : null }

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
                    disabled={this.state.loading}
                >{'Submit'}</Button>
            </Form>
        );
    }
}

SignupForm.propTypes = {
    onSubmit: React.PropTypes.func,
    error: React.PropTypes.string,
    loading: React.PropTypes.bool,
    deadline: React.PropTypes.string // TODO: Dates should be instanceOf(Date)
};
