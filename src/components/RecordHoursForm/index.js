import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import DateTimeInput from 'react-bootstrap-datetimepicker';
import SignaturePad from 'react-signature-pad';

export default class RecordHoursForm extends Component {
    render() {
        return (
            <Form title={'Record your time'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
            >
                <div className="form-group">
                    <input type="text"
                        name="place"
                        id="place"
                    />
                    <label htmlFor="place">{'Place volunteered'}</label>
                </div>
                <div className="form-group">
                    <input type="text"
                        name="hours"
                        id="hours"
                    />
                    <label htmlFor="hours">{'Hours'}</label>
                </div>
                <div className="form-group">
                    <DateTimeInput
                        inputProps={{
                            name: 'date',
                            id: 'date',
                        }}
                    />
                    <label htmlFor="date">{'Date'}</label>
                </div>
                <div className="form-group">
                    <input type="text"
                        name="supervisor"
                        id="supervisor"
                    />
                    <label htmlFor="supervisor">{'Supervisor'}</label>
                </div>
                <SignaturePad/>

                <Button type="btn-green-white">{'Submit'}</Button>
            </Form>
        );
    }
}
