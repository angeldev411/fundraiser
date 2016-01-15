/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as actions from '../../redux/actions';

/* Then React components */
import Translate from 'react-translate-component';
import { Link } from 'react-router';

/* Then view-related stuff */
import styles from './home.scss';

@connect((reduxState) => ({
    show: reduxState.main.showHello,
}))
export default class Home extends Component {
    handleClick = () => {
        this.props.dispatch(
            actions.showHello(!this.props.show)
        );
    };

    render() {
        return (
            <div>
                {this.props.show ? (<p><Translate content="hello" /></p>) : null}
                <button
                    className={classNames(
                        styles.button,
                        commonStyles.defaultColor
                    )}
                    onClick={this.handleClick}
                >
                    <Translate content="say.hello" />
                </button>
                <p>
                    <Link to="/unexisting-state">{'To an error'}</Link>
                </p>
            </div>
        );
    }
}

Home.propTypes = {
    show: React.PropTypes.bool,
};
