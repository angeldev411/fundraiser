import React, { Component } from 'react';
import ModalButton from '../../components/ModalButton';
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
        };
    }

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    render() {
        return (
            <div id={"pledge-container"}>
                <Form
                    id="pledge"
                    cols={"col-xs-12"}
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

                                <p id="pledge-goal">{`for ${this.props.goal} goal hours`}</p>
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
