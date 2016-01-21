/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';

/* Then React components */
import Page from '../../components/Page';
import Button from '../../components/Button';
import Cover from '../../components/Cover';

/* Then view-related stuff */
export default class Home extends Component {
    componentWillMount() {
        document.title = 'You + Us = A World of Change | Raiserve';
    }

    render() {
        const image = {
            backgroundImage: 'url(/assets/images/hands.jpg)',
            backgroundSize: 'cover',
        };

        return (
            <Page>
                <Cover image={image}
                    customclass={"home"}
                >
                    <h2 className="tagline">{"You + Us = A World of Change"}</h2>
                    <Button>
                        {"Contact Us"}
                    </Button>
                </Cover>
            </Page>
        );
    }
}

Home.propTypes = {
    show: React.PropTypes.bool,
};
