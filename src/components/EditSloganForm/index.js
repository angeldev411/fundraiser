import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';

export default class EditSloganForm extends Component {
    render() {
        return (
            <Form title={'Edit Slogan'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                id={"edit-slogan-form"}
            >
                <div className="form-group">
                    <input type="text"
                        name="slogan"
                        id="slogan"
                        defaultValue={this.props.value ? this.props.value : null}
                    />
                    <label htmlFor="slogan">{'Slogan'}</label>
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

EditSloganForm.propTypes = {
    value: React.PropTypes.string,
};
