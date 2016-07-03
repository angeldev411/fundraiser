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
            showHourly: true
        };
    }

    handleChange = (event, name) => {
        const value = event.nativeEvent.target.value;

        const newState = { error: '' };
        const isCurrency = /^\d{1,}(.[\d]{2})?$/;

        if ( value.trim().length ===0 || !isCurrency.test(value) )
          newState.error = 'Please enter a dollar amount';

        newState[name] = value;
        this.setState(newState);
    };

    handleSwitchForm = () => {
        const value = this.state.amount || this.state.hourly;
        if (this.state.amount) {
            this.setState({
                amount: null,
                hourly: value,
                showHourly: true
            });

        } else {
            this.setState({
                hourly: null,
                amount: value,
                showHourly: false
            });
        }
        this.focusInput();
    };

    hourlyMax() {
      return this.state.hourly * this.props.goal;
    }

    focusInput() {
      const input = this.refs.hourlyAmountInput ?
        this.refs.hourlyAmountInput :
        this.refs.oneTimeAmountInput;

      input.focus();
      input.value = input.value; // move cursor to end
    }

    getForm = () => {
        if (!this.state.showHourly) {
            return (
                <div>
                    <div className="input-group">
                        <span className="input-group-addon">$</span>
                        <input name="amount"
                            ref="oneTimeAmountInput"
                            className="pledge-amount"
                            onChange={(e) => { this.handleChange(e, 'amount') }}
                            value={this.state.amount}
                        />
                    </div>
                    <label htmlFor="amount">{'Pledge'}</label>
                    <span id={'tooltip-trigger'}>
                        <i
                            className={'fa fa-question'}
                            data-tip={`Your 100% tax deductible donation will be charged upon completion of checkout.`}
                            data-type={'success'}
                            data-class={'tooltip'}
                            data-multiline
                            data-event={'click'}
                        ></i>
                    </span>
                    <ReactTooltip />
                </div>
            );
        } else {
            return (
                <div>
                    <div className="input-group">
                        <span className="input-group-addon">$</span>
                        <input name="hourly"
                            ref="hourlyAmountInput"
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
                            data-tip={`Your 100% tax deductible sponsorship will be charged monthly for all hour completed that month. <br/> Your maximum overall donation to this project will be the goal hours x your hourly pledge. (If the volunteer volunteers more hours than their goal you will not be charged) <br/> If service hours have already been completed, those hours will be included in your first month of sponsorship.`}
                            data-type={'success'}
                            data-class={'tooltip'}
                            data-multiline
                            data-event={'click'}
                        ></i>
                    </span>
                    { this.state.hourly ?
                      (
                      <div id="pledge-calc">
                        <p>{`your $${this.state.hourly}/hr pledge`}</p>
                        <p>x</p>
                        <p>{`my ${this.props.goal} goal hours of service`}</p>
                        <p>=</p>
                        <p>{`$${this.hourlyMax()} maximum pledge`}</p>
                      </div>
                      )
                    : null }
                    <ReactTooltip />
                </div>
            );
        }
    };

    render() {
        let switcher = null;
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
                            volunteer={this.props.volunteer}
                            team={this.props.team}
                            project={this.props.project}
                            goal={this.props.goal}
                            onPledgeSuccess={this.props.onPledgeSuccess}
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

  volunteer: React.PropTypes.object,
  team: React.PropTypes.object.isRequired,
  project: React.PropTypes.object.isRequired,

  onPledgeSuccess: React.PropTypes.func
};
