import React, { Component } from 'react';
import ModalButton from '../../components/ModalButton';
import Button from '../../components/Button';
import Form from '../../components/Form';
import { connect } from 'react-redux';
import PledgeFormStep2 from '../../components/PledgeFormStep2';

// $ symbol and numbers are inversed in Options due to "direction: rtl" in the select CSS
const pledgeValues = [1, 5, 10, 50];
const cap = false;

export default class PledgeFormStep1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...(this.props.oneTimeOnly ? { amount: pledgeValues[0] } : { hourly: pledgeValues[0] }),
            // ...(this.props.oneTimeOnly ? { type: 0 } : { type: 1 }),
        };
    }

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    handleSwitchForm = () => {
        if (this.state.amount) {
            this.setState({
                amount: null,
                hourly: this.state.amount,
            });
        } else {
            this.setState({
                hourly: null,
                amount: this.state.hourly,
            });
        }
    };

    getForm = () => {
        if (this.props.oneTimeOnly) {
            return (
                <div>
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
        } else if (!this.props.oneTimeOnly && this.state.hourly) {
            const estimation = this.props.goal * this.state.hourly;

            return (
                <div>
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
                    <p id="pledge-goal">{`for ${this.props.goal} goal hours`}</p>
                    <p id="hourly-pledge-info">
                        {`Your Card will be charged monthly as your volunteer completes their hours. The amount is estimated to be $${estimation} per month. You can change your rate at any point.`}
                    </p>
                </div>
            )
        } else if (!this.props.oneTimeOnly && this.state.amount) {
            return (
                <div>
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
        }
    };

    render() {
        console.log(this.state);
        let switcher = null;

        if (!this.props.oneTimeOnly && this.state.amount) {
            switcher = (
                <span id={'switch-form'}>
                    {'Or make an '}
                    <Button
                        customClass="btn-switch-form"
                        onClick={this.handleSwitchForm}
                    >
                        {'hourly pledge'}
                    </Button>
                </span>
            );
        } else if (!this.props.oneTimeOnly && this.state.hourly) {
            switcher = (
                <span>
                    {'Or make a '}
                    <Button
                        customClass="btn-switch-form"
                        onClick={this.handleSwitchForm}
                    >
                        {'one time pledge'}
                    </Button>
                </span>
            );
        }

        return (
            <div id={"pledge-container"}>
                <Form
                    id="pledge"
                    cols={"col-xs-12"}
                >
                    <div className="form-group">
                        {this.getForm()}
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
                </Form>
                <ModalButton
                    customClass="btn-transparent-green btn-pledge"
                    content={
                        <PledgeFormStep2
                            pledgeData={{
                                ...(this.state),
                                teamSlug: this.props.teamSlug,
                                volunteerSlug: this.props.volunteerSlug,
                            }}
                        />
                    }
                >{'Continue'}</ModalButton>
                {switcher ? (
                    <div id={'switch-form'}>
                        {switcher}
                    </div>
                ) : (null)}
            </div>
        );
    }
}

PledgeFormStep1.propTypes = {
    teamSlug: React.PropTypes.string,
    volunteerSlug: React.PropTypes.string,
    goal: React.PropTypes.number,
    oneTimeOnly: React.PropTypes.bool,
};
