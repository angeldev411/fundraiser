import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';

export default class PledgeCancelForm extends Component {
    submit = () => {
        this.props.onSubmit();
    };

    render() {
        return (
            <Form id="passwordReset"
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                title={'Cancel your pledge'}
                onSubmit={this.submit}
            >
                {this.props.error ? (<p>{this.props.error}</p>) : null}
                <Button
                    type={'submit'}
                    customClass="btn-green-white"
                    disabled={this.props.loading}
                >{'Cancel my pledge'}</Button>
            </Form>
        );
    }
}

PledgeCancelForm.propTypes = {
    onSubmit: React.PropTypes.func,
    error: React.PropTypes.string,
    loading: React.PropTypes.bool,
    pledge: React.PropTypes.object,
};
