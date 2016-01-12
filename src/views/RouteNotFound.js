import React, { Component } from 'react';

/* Then React components */
import Translate from 'react-translate-component';
import { Link } from 'react-router';

/* Then view-related stuff */
import commonStyles from '../common/styles/main.scss';

export default class RouteNotFound extends Component {
    componentDidMount() {
    }

    render() {
        return (
            <div className={commonStyles.errorContainer}>
                <h1>
                    <Translate content="errors.RouteNotFound" />
                </h1>
                <div>
                    <Link to="/">
                        <Translate content="errors.goHome" />
                    </Link>
                </div>
            </div>
        );
    }
}
