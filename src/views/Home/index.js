/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../components/Page';
import Cover from '../../components/Cover';

/* Then view-related stuff */
export default class Home extends Component {
    componentWillMount() {
        document.title = 'You + Us = A World of Change | Raiserve';
    }

    render() {
        return (
            <Page>
                <Cover image={"url(/assets/images/hands.jpg)"}
                    customclass={"cover-home"}
                    tagline={"You + Us = A World of Change"}
                    button={"Contact Us"}
                />
            </Page>
        );
    }
}

Home.propTypes = {
    show: React.PropTypes.bool,
};
