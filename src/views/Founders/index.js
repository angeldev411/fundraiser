/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../components/Page';
import Layout34 from '../../components/Layout34';

/* Then view-related stuff */
export default class Founders extends Component {
    componentWillMount() {
        document.title = 'Founders | Raiserve';
    }

    render() {
        return (
            <Page>
                <div className={"container main-content no-cover"}>
                    <Layout34 page={'founders'}>
                        <h2>{'The founders.'}</h2>
                        <p>
                            {'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure'}
                        </p>
                        <h3>{'Ryall.'} <a href="mailto:email@example.com">{'Email me'}</a></h3>
                        <p>
                            {'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure'}
                        </p>
                        <h3>{'Joel.'} <a href="mailto:email@example.com">{'Email me'}</a></h3>
                        <p>
                            {'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure'}
                        </p>
                    </Layout34>
                </div>
            </Page>
        );
    }
}

Founders.propTypes = {
    show: React.PropTypes.bool,
};
