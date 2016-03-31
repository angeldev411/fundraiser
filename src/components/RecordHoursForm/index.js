import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import DateTimeInput from 'react-bootstrap-datetimepicker';
import SignaturePad from 'react-signature-pad';
import * as Actions from '../../redux/volunteer/actions';
import { connect } from 'react-redux';
import moment from 'moment';


export default class RecordHoursForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            place: '',
            hours: 0,
            date: moment().format('YYYY-MM-DD').toString(),
            supervisor: '',
            supervisorEmail: '',
            signature: '',
            signatureRequired: props.team.signatureRequired,
            approved: props.team.hoursApprovalRequired ? false : true,
            loading: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hourLogFailure) {
            this.setState({
                error: nextProps.hourLogFailure,
                loading: false,
            });
        } else if (nextProps.hourLogSuccess) {
            this.setState({
                hasSuccessfulRecord: nextProps.hourLogSuccess,
                loading: false,
            });
        }

        if (nextProps.team) {
            this.setState({
                team: nextProps.team,
                loading: false,
            });
        }
    }

    recordHours = () => {
        this.setState({
            loading: true,
        });

        let signature = '';

        if (this.state.signatureRequired) {
            // Get the Signature as a base64 encode string
            signature = this.refs.signature.toDataURL();
        }

        Actions.createHourLog(
            this.state.place,
            this.state.hours,
            this.state.date,
            this.state.supervisorEmail,
            this.state.supervisor,
            signature,
            this.state.approved,
        )(this.props.dispatch);
    };

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    setDate = (value) => {
        this.setState(
            {
                date: moment(value).format().toString(),
            }
        );
    };

    getError = () => {
        return this.state.error;
    };

    render() {
        return (
            <Form title={'Record your time'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
            >
                <div className="form-group">
                    <input type="text"
                        name="place"
                        id="place"
                        onChange={(e) => { this.handleChange(e, 'place') }}
                        placeholder={'Example: Habitat For Humanity - NY, NY'}
                    />
                    <label htmlFor="place">{'Place volunteered - Be Specific'}</label>
                </div>
                <div className="form-group">
                    <input type="text"
                        name="hours"
                        id="hours"
                        onChange={(e) => { this.handleChange(e, 'hours') }}
                    />
                    <label htmlFor="hours">{'Hours'}</label>
                </div>
                <div className="form-group">
                    <DateTimeInput
                        inputProps={{
                            name: 'date',
                            id: 'date',
                        }}
                        onChange={(e) => { this.setDate(e) }}
                        inputFormat={'YYYY-MM-DD'}
                        format={'YYYY-MM-DD'}
                        mode={'date'}
                        dateTime={this.state.date}
                    />
                    <label htmlFor="date">{'Date'}</label>
                </div>
                {this.props.team.signatureRequired ?
                    <div>
                        <div className="form-group">
                            <input type="text"
                                name="supervisorEmail"
                                id="supervisorEmail"
                                onChange={(e) => { this.handleChange(e, 'supervisorEmail') }}
                            />
                            <label htmlFor="supervisorEmail">{'Supervisor Email'}</label>
                        </div>
                        <div className="form-group">
                            <input type="text"
                                name="supervisor"
                                id="supervisor"
                                onChange={(e) => { this.handleChange(e, 'supervisor') }}
                            />
                            <label htmlFor="supervisor">{'Supervisor Name'}</label>
                        </div>

                        <div className="form-group">
                            <SignaturePad ref='signature'/>
                            <label htmlFor="signature">{'Signature'}</label>
                        </div>
                    </div>
                    : null
                }

                <Button
                    onClick={this.recordHours}
                    customClass="btn-green-white"
                    disabled={this.state.loading}
                >
                        {'Submit'}
                </Button>
            </Form>
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    hourLogSuccess: reduxState.main.volunteer.hourLogSuccess,
    hourLogFailure: reduxState.main.volunteer.hourLogFailure,
}))(RecordHoursForm);
