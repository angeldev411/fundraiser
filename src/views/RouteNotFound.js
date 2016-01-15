import React, { Component } from 'react';

/* Then React components */
import { Link } from 'react-router';

export default class RouteNotFound extends Component {
    componentDidMount() {
    }

    render() {
        return (
            <div className={commonStyles.errorContainer}>
                <h1>
                    404
                </h1>
                <div>
                    <Link to="/">
                        Home
                    </Link>
                </div>
            </div>
        );
    }
}
