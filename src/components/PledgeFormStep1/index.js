import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import ModalButton from '../../components/ModalButton';
import Button from '../../components/Button';
import Form from '../../components/Form';
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
                    <label htmlFor="hourly"
                        id={'tooltip-label'}
                    >
                        {'Pledge per Hour'}
                    </label>
                    <span id={'tooltip-trigger'}>
                        <i
                            className={'fa fa-question'}
                            data-tip={`Your Card will be charged monthly as your volunteer(s) completes their hours. You can change your rate at any point.`}
                            data-type={'success'}
                            data-class={'tooltip'}
                            data-multiline
                            data-event={'click'}
                        ></i>
                    </span>
                    <p id="pledge-goal">{this.props.goal ? `for ${this.props.goal} goal hours` : null}</p>
                    <ReactTooltip />
                </div>
            );
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
            );
        }
    };

    render() {
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
