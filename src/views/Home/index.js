/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as actions from '../../redux/actions';

/* Then React components */
import Page from '../../components/Page';
import Button from '../../components/Button';

/* Then view-related stuff */
import commonStyles from '../../common/styles/main.scss';
import styles from './home.scss';

@connect((reduxState) => ({
    show: reduxState.main.showHello,
}))
export default class Home extends Component {
    componentDidMount() {
        document.title = 'Homepage';
    }

    render() {
        return (
            <Page>
                <div className={styles.home_cover}>
                    <div className={"container"}>
                        <h2>{"You + Us = A World of Change"}</h2>
                        <Button>
                            {"Contact Us"}
                        </Button>
                    </div>
                </div>
            </Page>
        );
    }
}

Home.propTypes = {
    show: React.PropTypes.bool,
};
