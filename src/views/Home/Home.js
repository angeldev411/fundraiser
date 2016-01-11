/* Import "logic" dependencies first */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import * as actions from '../../redux/actions';

/* Then React components */
import Translate from 'react-translate-component';
import {Link} from 'react-router';

/* Then view-related stuff */
import commonStyles from '../../common/styles/main.scss';
import styles from './home.scss';

class Home extends Component {
    click = () => {
        this.props.dispatch(actions.showHello(!this.props.show));
    }

    render() {
        return (
            <div>
                { this.props.show ? (<p><Translate content='hello' /></p>) : null }
                <button
                    className={classNames(
                        styles.button,
                        commonStyles.defaultColor
                    )}
                    onClick={this.click}
                >
                    <Translate content='say.hello' />
                </button>
            </div>
        );
    }
}

export default connect((reduxState) => {
    return {
        show: reduxState.main.showHello
    };
})(Home);
