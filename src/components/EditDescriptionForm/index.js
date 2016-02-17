import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';

export default class EditDescriptionForm extends Component {
    render() {
        return (
            <Form title={'Edit Description'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                id={"edit-description-form"}
            >
                <div className="form-group">
                    <textarea
                        name="description"
                        id="description"
                        defaultValue="Why Your Volunteering, Why this matters to you. Be inspiring as this will engage people to sponsor you."
                        rows="3"
                    />
                    <label htmlFor="description">{'Description'}</label>
                </div>
                <Button
                    customClass="btn-green-white"
                    type={'submit'}
                >
                    {'save'}
                </Button>
            </Form>
        );
    }
}
