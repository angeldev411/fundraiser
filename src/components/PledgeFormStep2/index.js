import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Form from '../../components/Form';
import * as Actions from '../../redux/pledge/actions';

class PledgeFormStep2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...(this.props.pledgeData),
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        } else if (nextProps.pledge) {
            //
        }
    }

    stripeResponseHandler = (status, response) => {
        if (response.error) {
            // Show the errors on the form
            this.setState({
                error: response.error.message,
            });
        } else {
            // response contains id and card, which contains additional card details
            const token = response.id;

            // If ok, add sponsor to db
            Actions.newPledge(
                this.state.firstName,
                this.state.lastName,
                this.state.email,
                this.state.hourly,
                this.state.amount,
                this.state.teamSlug,
                this.state.volunteerSlug,
                token,
            )(this.props.dispatch);
        }
    };

    submit = () => {
        // Client side verifications
        const validator = this.verifyCardInfo(this.state.cc, this.state.cvv, this.state.expiration);

        if (validator.error) {
            this.setState({
                error: validator.message,
            });
        } else {
            this.setState({
                error: null,
            });
            // Send to Stripe and verify Credit Card infos
            Stripe.card.createToken({
                number: this.state.cc,
                cvc: this.state.cvv,
                exp: this.state.expiration,
            }, this.stripeResponseHandler);
        }
    };

    verifyCardInfo = (cc, cvv, exp) => {
        if (!Stripe.card.validateCardNumber(cc)) {
            return {
                error: true,
                message: 'Invalid card number',
            };
        }
        if (!Stripe.card.validateCVC(cvv)) {
            return {
                error: true,
                message: 'Invalid CVV',
            };
        }

        if (!Stripe.card.validateExpiry(exp)) {
            return {
                error: true,
                message: 'Invalid expiration date',
            };
        }
        return {
            error: false,
        };
    };

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    render() {
        return (
            <Form id="pledgestep2"
                cols={"col-xs-12 col-md-6 col-md-offset-3"}
                description="Need text here to inform sponsor"
                title={'Make a Pledge'}
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

                <div className="form-group">
                    <input type="text"
                        name="cc"
                        id="cc"
                        onChange={(e) => { this.handleChange(e, 'cc') }}
                    />
                    <label htmlFor="cc">{'Credit Card Number'}</label>
                </div>

                <div className="form-group">
                    <input type="text"
                        name="cvv"
                        id="cvv"
                        onChange={(e) => { this.handleChange(e, 'cvv') }}
                    />
                    <label htmlFor="cvv">{'Card Verification Value (CVV)'}</label>
                </div>

                <div className="form-group">
                    <input type="text"
                        name="expiration"
                        id="expiration"
                        onChange={(e) => { this.handleChange(e, 'expiration') }}
                    />
                    <label htmlFor="expiration">{'Expiration date (MM/AA)'}</label>
                </div>

                {this.state.error ? <p>{this.state.error}</p> : null}

                <div className="form-group form-buttons">
                    <Button
                        customClass="btn-transparent-green"
                        type={'submit'}
                    >{'Pledge'}</Button>
                </div>
            </Form>
        );
    }
}

PledgeFormStep2.propTypes = {
    title: React.PropTypes.string,
    pledgeData: React.PropTypes.object,
};

export default connect((reduxState) => ({
    error: reduxState.main.pledge.error,
    pledge: reduxState.main.pledge.pledge,
}))(PledgeFormStep2);