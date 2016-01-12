import React, { Component } from 'react';

import styles from './container.scss';

export default class Container extends Component {
    render() {
        return (
            <div
                className={styles.container}
            >
                {this.props.children}
            </div>
        );
    }
}
