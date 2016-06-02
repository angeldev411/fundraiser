import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import ModalButton from '../../components/ModalButton';
import Button from '../../components/Button';
import Form from '../../components/Form';
import PledgeFormStep2 from '../../components/PledgeFormStep2';

// $ symbol and numbers are inversed in Options due to "direction: rtl" in the select CSS
const defaultAmount = 10;

export default class PledgeFormStep1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...(this.props.oneTimeOnly ? { amount: defaultAmount } : { hourly: defaultAmount }),
            maxCap: null,
            error: false,
        };
    }

    handleChange = (event, name) => {
        const value = event.nativeEvent.target.value;
        
        const newState = {
            error: (_(value).isEmpty() && 'Please enter an amount'),
        };

        newState[name] = value;
        this.setState(newState);
    };

    handleSwitchForm = () => {
        const value = this.state.amount || this.state.hourly;
        if (this.state.amount) {
            this.setState({
                amount: null,
                hourly: value,
            });
        } else {
            this.setState({
                hourly: null,
                amount: value,
            });
        }
    };

    getForm = () => {
        if (this.state.amount) {
            return (
                <div>
                    <div className="input-group">
                        <span className="input-group-addon">$</span>
                        <input name="amount"
                            className="pledge-amount"
                            onChange={(e) => { this.handleChange(e, 'amount') }}
                            value={this.state.amount}
                        />
                    </div>
                    <label htmlFor="amount">{'Pledge'}</label>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="input-group">
                        <span className="input-group-addon">$</span>
                        <input name="hourly"
                            className="pledge-amount"
                            onChange={(e) => { this.handleChange(e, 'hourly') }}
                            value={this.state.hourly}
                        />
                    </div>
                    <label htmlFor="hourly"
                        id={'tooltip-label'}
                    >
                        {'Pledge per Hour'}
                    </label>
                    <span id={'tooltip-trigger'}>
                        <i
                            className={'fa fa-question'}
                            data-tip={`Your credit card will be charged monthly for all hours completed that month up to the number of goal hours. If service hours have already been completed, those hours will be included in your first month of sponsorship`}
                            data-type={'success'}
                            data-class={'tooltip'}
                            data-multiline
                            data-event={'click'}
                        ></i>
                    </span>
                    <p id="pledge-goal">{this.props.goal ? `Goal: ${this.props.goal} hours` : null}</p>
                    <p id="pledge-deadline">{this.props.deadline ? `by ${this.props.deadline}` : null}</p>
                    <ReactTooltip />
                </div>
            );
        }
    };

    render() {
        let switcher = null;
        console.log(this.state);
        if (!this.state.hourly) {
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
        } else {
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

        const estimation = this.props.goal * this.state.hourly;

        return (
            <div id={"pledge-container"}>
                <Form
                    id="pledge"
                    cols={"col-xs-12"}
                >
                    <div className="form-group">
                        {this.getForm()}
                    </div>

                    {this.state.error ? <p>{this.state.error}</p> : null}
                </Form>
                <ModalButton
                    customClass="btn-transparent-green btn-pledge"
                    disabled={this.state.error}
                    content={
                        <PledgeFormStep2
                            pledgeData={{
                                ...(this.state),
                                teamSlug: this.props.teamSlug,
                                volunteerSlug: this.props.volunteerSlug,
                                maxCap: estimation,
                            }}
                            goal={this.props.goal}
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
  deadline: React.PropTypes.string,
  oneTimeOnly: React.PropTypes.bool,
};
