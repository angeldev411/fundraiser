import React, {Component} from 'react';

import StaticContainer from 'react-static-container';

import styles from './container.scss';

export default class Container extends Component {
    render() {
        return (
            <StaticContainer
                className={styles.container}
            >
                {this.props.children}
            </StaticContainer>
        );
    }
}
