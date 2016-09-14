import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import DateTimeInput from 'react-bootstrap-datetimepicker';
import 'components/_react-bootstrap-datetime-picker.scss';
import SignaturePad from 'react-signature-pad';
import * as Actions from '../../redux/volunteer/actions';
import { connect } from 'react-redux';
import moment from 'moment';


export class RecordHoursForm extends Component {
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

    recordHours = () => {
        this.setState({
          loading: true
        });

        let error;

        if (!this.state.date.trim().length || !moment( new Date(this.state.date) ).isValid())
          error = 'When did you volunteer?';

        if (isNaN(this.state.hours) || this.state.hours <= 0) error = 'How many hours?';

        if (!this.state.place.trim().length) error = 'Where did you volunteer?';

        if (error) {
          this.setState({
            error,
            loading: false,
          });
          return;
        }

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
                date: moment(new Date(value)).format(),
            }
        );
    };

    render() {
        return (
            <Form title={'Record your time'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
            >
                { this.props.team.hoursApprovalRequired ?
                    <p>Your team requires approval for all volunteer hours. They will be added and appear on your dashboard once approved.</p>
                    : null
                }
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
                        value={this.state.hours}
                        onChange={(e) => { this.handleChange(e, 'hours') }}
                    />
                    <label htmlFor="hours">{'Hours'}</label>
                </div>
                <div className="form-group" style={{ position: 'relative' }}>
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

                {this.state.error ? <p>{this.state.error}</p> : null}

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

RecordHoursForm.propTypes = {
  team:       React.PropTypes.object.isRequired
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    hourLogSuccess: reduxState.main.volunteer.hourLogSuccess,
    hourLogFailure: reduxState.main.volunteer.hourLogFailure
}))(RecordHoursForm);
