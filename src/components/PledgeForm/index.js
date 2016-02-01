import React, { Component } from 'react';
import Button from '../../components/Button';

export default class PledgeForm extends Component {
    render() {
        return (
            <div className="pledge-form form-container col-xs-12">
                <form id="pledge">
                    <div className="form-group">
                        <select name="amount"
                            className="pledge-amount"
                        >
                            <option value="1">{'1 $'}</option>
                            <option value="5">{'5 $'}</option>
                            <option value="10">{'10 $'}</option>
                            <option value="50">{'50 $'}</option>
                        </select>
                        <label htmlFor="amount">{'Pledge per Hour'}</label>
                    </div>

                    <div className="form-group">
                        <input type="text"
                            name="max-amount"
                            id="max-amount"
                        />
                        <label htmlFor="max-amount">{'Maximum total amount (Optional)'}</label>
                    </div>

                    <Button type="btn-pledge">{'Continue'}</Button>
                </form>
            </div>
        );
    }
}

PledgeForm.propTypes = {

};
