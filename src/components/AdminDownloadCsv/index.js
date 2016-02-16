import React, { Component } from 'react';
import Button from '../Button';

export default class AdminDownloadCsv extends Component {
    // TODO define share data.
    render() {
        return (
            <section className="download-csv">
                <span className="title uppercase">{'Take this list with you'}</span>
                <p>{'Keep this information with you for offline accounting or tracking'}</p>
                <Button customClass={'btn-green-white'}>{'Download CSV'}</Button>
            </section>
        );
    }
}
