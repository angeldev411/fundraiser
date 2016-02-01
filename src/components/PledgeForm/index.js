import React, { Component } from 'react';
import Button from '../../components/Button';

// $ symbol and numbers are inversed in Options due to "direction: rtl" in the select CSS
const pledgeValues = [1, 5, 10, 50];

export default class PledgeForm extends Component {
    render() {
        return (
            <div className="pledge-form form-container col-xs-12">
                <form id="pledge">
                    <div className="form-group">
                        <select name="amount"
                            className="pledge-amount"
                        >
                            {pledgeValues.map((value, i) =>
                                (<option key={i}
                                    value={value}
                                 >
                                    {`${value} $`}
                                </option>)
                            )}
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

                    <div className="form-group form-buttons">
                        <Button type="btn-pledge">{'Continue'}</Button>
                    </div>
                </form>
            </div>
        );
    }
}
