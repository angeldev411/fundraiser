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
            success: false,
            loading: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({
                error: nextProps.error,
                loading: false,
            });
        } else if (nextProps.pledge) {
            this.setState({
                success: true,
                loading: false,
            });
        }
    }

    stripeResponseHandler = (status, response) => {
        if (response.error) {
            // Show the errors on the form
            this.setState({
                error: response.error.message,
                loading: false,
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
                this.state.maxCap,
            )(this.props.dispatch);
        }
    };

    submit = () => {
        this.setState({
            loading: true,
        });
        // Client side verifications
        const validator = this.verifyCardInfo(this.state.cc, this.state.cvv, this.state.expiration);

        if (validator.error) {
            this.setState({
                error: validator.message,
                loading: false,
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
        if (this.state.success) {
            return (
                <p id={'sucess-pledge'}>
                    {'Thanks for your donation!'}
                </p>
            );
        }

        return (
            <Form id="pledgestep2"
                cols={"col-xs-12 col-md-6 col-md-offset-3"}
                onSubmit={this.submit}
            >
                <div
                    id={'payment-header'}
                    className={'col-xs-12'}
                >
                    <div
                        className={'col-xs-8'}
                        id={'secure-payment'}
                    >
                        <img src="/assets/images/secure-payment.png"/>
                    </div>
                    <div
                        className={'col-xs-4'}
                        id={'pledge-info'}
                    >
                        {
                            this.state.hourly ?
                            (
                                <span>
                                    <span id={'hourly-amount'}><b>{`$${this.state.hourly}`}</b>{'/hr'}</span>
                                    <span id={'goal'}>{`x ${this.props.goal} goal hrs`}</span>
                                </span>
                            ) :
                            (
                                <span>
                                    <span id={'hourly-amount'}><b>{`$${this.state.amount}`}</b></span>
                                </span>
                            )
                        }
                    </div>
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

                <div className="form-group">
                    <input type="text"
                        name="email"
                        id="email"
                        onChange={(e) => { this.handleChange(e, 'email') }}
                    />
                    <label htmlFor="email">{'Email'}</label>
                </div>

                <div
                    className={'col-xs-12'}
                    id={'credit-card-details'}
                >
                    <div
                        className={'col-xs-2'}
                        id={'credit-cards'}
                    >
                        <img src="/assets/images/credit-cards.png"/>
                    </div>
                    <div className={'col-xs-10'}>
                        <div className={'col-xs-12'}>
                            <div className="form-group">
                                <input type="text"
                                    name="cc"
                                    id="cc"
                                    onChange={(e) => { this.handleChange(e, 'cc') }}
                                />
                                <label htmlFor="cc">{'Credit Card Number'}</label>
                            </div>
                        </div>
                        <div className={'col-xs-6 cvv'}>
                            <div className="form-group">
                                <input type="text"
                                    name="cvv"
                                    id="cvv"
                                    onChange={(e) => { this.handleChange(e, 'cvv') }}
                                />
                                <label htmlFor="cvv">{'Card Verification Value (CVV)'}</label>
                            </div>
                        </div>
                        <div className={'col-xs-6 exp'}>
                            <div className="form-group">
                                <input type="text"
                                    name="expiration"
                                    id="expiration"
                                    onChange={(e) => { this.handleChange(e, 'expiration') }}
                                />
                                <label htmlFor="expiration">{'Expiration date (MM/YY)'}</label>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.error ? <p>{this.state.error}</p> : null}

                <div className="form-group form-buttons">
                    <Button
                        customClass="btn-primary btn-lg"
                        type={'submit'}
                        disabled={this.state.loading}
                    >{'Pledge now'}</Button>
                    <img
                        id={'powered'}
                        src="/assets/images/payment-powered-stripe.png"
                    />
                </div>
            </Form>
        );
    }
}

PledgeFormStep2.propTypes = {
    title: React.PropTypes.string,
    pledgeData: React.PropTypes.object,
    goal: React.PropTypes.number,
};

export default connect((reduxState) => ({
    error: reduxState.main.pledge.error,
    pledge: reduxState.main.pledge.pledge,
}))(PledgeFormStep2);
