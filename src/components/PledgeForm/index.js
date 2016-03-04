import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import { connect } from 'react-redux';
import * as Actions from '../../redux/pledge/actions';


// $ symbol and numbers are inversed in Options due to "direction: rtl" in the select CSS
const pledgeValues = [1, 5, 10, 50];
const cap = false;

class PledgeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            ...(this.props.oneTimeOnly ? { amount: pledgeValues[0] } : { hourly: pledgeValues[0] })
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        } else if (nextProps.pledge) {
            //
        }
    }

    submit = () => {
        if (!this.state.firstName) { // If no personal data, go to step 2 form
            this.setState({
                step: 2,
            })
        } else {
            Actions.newPledge(
                this.state.firstName,
                this.state.lastName,
                this.state.email,
                this.state.hourly,
                this.state.amount,
                this.props.teamSlug,
                this.props.volunteerSlug
            )(this.props.dispatch);
        }
    };

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    render() {
        const step1 = (
            <Form id="pledge"
                cols={"col-xs-12"}
                onSubmit={this.submit}
            >
                <div className="form-group">

                    {this.props.oneTimeOnly
                        ? (<div>
                            <select name="amount"
                                className="pledge-amount"
                                onChange={(e) => { this.handleChange(e, 'amount') }}
                            >
                                {pledgeValues.map((value, i) =>
                                    (<option key={i}
                                        value={value}
                                     >
                                        {`${value} $`}
                                    </option>)
                                )}
                            </select>
                            <label htmlFor="amount">{'Pledge'}</label>
                        </div>
                        )
                        : (<div>
                            <select name="hourly"
                                className="pledge-amount"
                                onChange={(e) => { this.handleChange(e, 'hourly') }}
                            >
                                {pledgeValues.map((value, i) =>
                                    (<option key={i}
                                        value={value}
                                     >
                                        {`${value} $`}
                                    </option>)
                                )}
                            </select>
                            <label htmlFor="hourly">{'Pledge per Hour'}</label>
                        </div>
                        )
                    }
                </div>

                {cap ? (
                    <div className="form-group">
                        <input type="text"
                            name="max-amount"
                            id="max-amount"
                            onChange={(e) => { this.handleChange(e, 'max-amount') }}
                        />
                        <label htmlFor="max-amount">{'Maximum total amount (Optional)'}</label>
                    </div>
                ) : null}

                {this.state.error ? <p>{this.state.error}</p> : null}

                <div className="form-group form-buttons">
                    <Button
                        customClass="btn-transparent-green btn-pledge"
                        type={'submit'}
                    >{'Continue'}</Button>
                </div>
            </Form>
        )

        const step2 = (
            <Form id="pledge"
                cols={"col-xs-12"}
                onSubmit={this.submit}
            >
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
                    <input type="text"
                        name="email"
                        id="email"
                        onChange={(e) => { this.handleChange(e, 'email') }}
                    />
                    <label htmlFor="email">{'Email'}</label>
                </div>

                {this.state.error ? <p>{this.state.error}</p> : null}

                <div className="form-group form-buttons">
                    <Button
                        customClass="btn-transparent-green btn-pledge"
                        type={'submit'}
                    >{'Continue'}</Button>
                </div>
            </Form>
        );

        if (this.state.step === 1) {
            return step1;
        } else if (this.state.step === 2) {
            return step2;
        }
    }
}

PledgeForm.propTypes = {
    teamSlug: React.PropTypes.string,
    volunteerSlug: React.PropTypes.string,
    oneTimeOnly: React.PropTypes.bool,
};

export default connect((reduxState) => ({
    error: reduxState.main.pledge.error,
    pledge: reduxState.main.pledge.pledge,
}))(PledgeForm);
