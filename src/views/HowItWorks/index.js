/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../components/Page';
import Layout34 from '../../components/Layout34';

export default class HowItWorks extends Component {
    componentWillMount() {
        document.title = 'How It Works | Raiserve';
    }

    render() {
        return (
            <Page>
                <div className={"container main-content no-cover"}>
                    <Layout34 page={'howitworks'}>
                        <h2>{'YOU + US'}<br/>{'= A WORLD OF CHANGE'}</h2>
                        <h3>{'How It Works.'}</h3>
                        <p>
                            {'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat'}
                        </p>
                    </Layout34>
                </div>
            </Page>
        );
    }
}

HowItWorks.propTypes = {
    show: React.PropTypes.bool,
};
