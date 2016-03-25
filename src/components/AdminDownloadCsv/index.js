import React, { Component } from 'react';
import { Link } from 'react-router';
import Button from '../Button';

export default class AdminDownloadCsv extends Component {
    render() {
        return (
            <section className="download-csv">
                <span className="title uppercase">{'Take this list with you'}</span>
                <p>{'Keep this information with you for offline accounting or tracking'}</p>
                <Link
                    to={this.props.to}
                    target={'_blank'}
                >
                    <Button
                        customClass={'btn-green-white'}
                    >
                        {'Download CSV'}
                    </Button>
                </Link>

            </section>
        );
    }
}

AdminDownloadCsv.propTypes = {
    to: React.PropTypes.string,
};
