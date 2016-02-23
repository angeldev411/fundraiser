import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import DateTimeInput from 'react-bootstrap-datetimepicker';
import SignaturePad from 'react-signature-pad';
import * as Actions from '../../redux/volunteer/actions';
import { connect } from 'react-redux';
import moment from 'moment'


export default class RecordHoursForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            place: '',
            hours: 0,
            date: moment().format('DD MM YYYY').toString(),
            supervisor: '',
            signature: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log('nextProps', nextProps);
        if (nextProps.hourLogFailure) {
            this.setState({ error: nextProps.hourLogFailure });
        } else if (nextProps.hourLogSuccess) {
            this.setState({ hasSuccessfulRecord: nextProps.hourLogSuccess });
        }
    }

    recordHours = () => {
        // Get the Signature as a base64 encode string
        const signature = this.refs.signature.toDataURL();

        Actions.createHourLog(
            this.state.place,
            this.state.hours,
            this.state.date,
            this.state.supervisor,
            signature,
        )(this.props.dispatch);

        console.log(this.state.date);
    };

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    setDate = (value) => {
        this.setState(
            {
                date: moment.utc(value).local(),
            }
        );
        // this.state.date = moment.unix(value/1000).format('DD MM YYYY').toString();
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
                    />
                    <label htmlFor="place">{'Place volunteered'}</label>
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
                    />
                    <label htmlFor="date">{'Date'}</label>
                </div>
                <div className="form-group">
                    <input type="text"
                        name="supervisor"
                        id="supervisor"
                        onChange={(e) => { this.handleChange(e, 'supervisor') }}
                    />
                    <label htmlFor="supervisor">{'Supervisor'}</label>
                </div>
                <SignaturePad ref="signature"/>

                <Button onClick={this.recordHours} customClass="btn-green-white">{'Submit'}</Button>
            </Form>
        );
    }
}

export default connect((reduxState) => ({
    hourLogSuccess: reduxState.main.volunteer.hourLogSuccess,
    hourLogFailure: reduxState.main.volunteer.hourLogFailure,
}))(RecordHoursForm);
