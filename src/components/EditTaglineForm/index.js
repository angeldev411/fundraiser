import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';

export default class EditTaglineForm extends Component {
    render() {
        return (
            <Form title={'Edit Tagline'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                id={"edit-tagline-form"}
            >
                <div className="form-group">
                    <textarea
                        name="tagline"
                        id="tagline"
                        defaultValue={this.props.value ? this.props.value : null}
                        rows="3"
                    />
                    <label htmlFor="tagline">{'Tagline'}</label>
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

EditTaglineForm.propTypes = {
    value: React.PropTypes.string,
};
