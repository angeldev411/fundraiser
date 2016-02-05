import React, { Component } from 'react';

/* Then React components */
import { Link } from 'react-router';
import Page from '../components/Page';
import SimpleLayout from '../components/SimpleLayout';
import Button from '../components/Button';


export default class RouteNotFound extends Component {
    componentDidMount() {
    }

    render() {
        return (
            <Page>
                <div className={"container main-content no-cover"}>
                    <SimpleLayout page={'404'}>
                        <h1>
                            404
                        </h1>
                        <div>
                            <Button to="/"
                                type="btn-green-white btn-lg"
                            >
                                Back to Home
                            </Button>
                        </div>
                    </SimpleLayout>
                </div>
            </Page>
        );
    }
}
