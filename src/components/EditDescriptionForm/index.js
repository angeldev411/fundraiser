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
                        defaultValue={this.props.value ? this.props.value : null}
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

EditDescriptionForm.propTypes = {
    value: React.PropTypes.string,
};
