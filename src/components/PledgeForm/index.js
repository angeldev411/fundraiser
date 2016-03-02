import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import { connect } from 'react-redux';
// import * as Actions from '../../redux/pledge/actions';


// $ symbol and numbers are inversed in Options due to "direction: rtl" in the select CSS
const pledgeValues = [1, 5, 10, 50];
const cap = false;

class PledgeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        } else if (nextProps.pledge) {
            //
        }
    }

    submit = () => {
        Actions.newPledge(
            this.state.hourly,
            this.state.amount,
            this.props.teamId,
            this.props.volunteerId
        )(this.props.dispatch);
    };

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    render() {
        return (
            <Form id="pledge"
                cols={"col-xs-12"}
            >
                <div className="form-group">
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
                    {this.props.oneTimeOnly
                        ? (<label htmlFor="amount">{'Pledge'}</label>)
                        : (<label htmlFor="amount">{'Pledge per Hour'}</label>)
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

                <div className="form-group form-buttons">
                    <Button customClass="btn-transparent-green btn-pledge">{'Continue'}</Button>
                </div>
            </Form>
        );
    }
}

PledgeForm.propTypes = {
    teamId: React.PropTypes.string,
    volunteerId: React.PropTypes.string,
    oneTimeOnly: React.PropTypes.bool,
};

export default connect((reduxState) => ({
    error: reduxState.main.project.error,
    project: reduxState.main.project.project,
}))(PledgeForm);
