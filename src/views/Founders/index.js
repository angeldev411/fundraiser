/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';

/* Then React components */
import Page from '../../components/Page';
import Aside from '../../components/Aside';

/* Then view-related stuff */
export default class Founders extends Component {
    componentDidMount() {
        document.title = 'Founders';
    }

    render() {
        return (
            <Page>
                <div className={"container main-content"}>
                    <Aside/>
                    <div className={'col-xs-12 col-lg-8'}>
                        bla
                    </div>
                </div>
            </Page>
        );
    }
}

Founders.propTypes = {
    show: React.PropTypes.bool,
};
