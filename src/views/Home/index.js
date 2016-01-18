/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';

/* Then React components */
import Page from '../../components/Page';
import Button from '../../components/Button';

/* Then view-related stuff */
export default class Home extends Component {
    componentDidMount() {
        document.title = 'Homepage';
    }

    render() {
        const background = {
            backgroundImage: 'url(/assets/images/hands.jpg)',
            backgroundSize: 'cover',
        };

        return (
            <Page style={background}>
                <div className={'home_cover'}>
                    <div className={"container"}>
                        <h2 className="tagline">{"You + Us = A World of Change"}</h2>
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
