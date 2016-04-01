/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/pledge/actions';

/* Then React components */
import Page from '../../components/Page';
import Button from '../../components/Button';
import PledgeCancelForm from '../../components/PledgeCancelForm';

class PledgeCancel extends Component {
    constructor(props) {
        super(props);

        const cancelToken = this.getParam('t');

        if (!cancelToken) {
            window.location = '/';
        }

        if (cancelToken) {
            this.state = {
                cancelToken,
                loading: false,
                canceled: false,
            };
        }
    }

    componentWillMount() {
        document.title = `Cancel a pledge | Raiserve`;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pledge) {
            this.setState({
                loading: false,
                canceled: true,
            });
        } else if (nextProps.error) {
            this.setState({
                error: nextProps.error,
                loading: false,
            });
        }
    }

    handleSubmit = (data) => {
        this.setState({
            loading: true,
        });

        Actions.cancelPledge(this.state.cancelToken)(this.props.dispatch);
    };

    getParam = (variable) => {
        const query = window.location.search.substring(1);
        const vars = query.split('&');

        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');

            if (pair[0] === variable) {
                return pair[1];
            }
        }
    };

    render() {
        if (this.state.canceled) {
            return (
                <Page noHeader={true}
                    bodyBackground={{ backgroundColor: 'black' }}
                >
                    <div className={"main-content"}>
                        <div className={"container cancelPledgeContainer"}>
                            <h2>{'Your pledge has been canceled'}</h2>
                            <Button to="/"
                                customClass="btn-green-white btn-lg"
                            >
                                Back to Home
                            </Button>
                        </div>
                    </div>
                </Page>
            );
        }
        return (
            <Page noHeader={true}
                bodyBackground={{ backgroundColor: 'black' }}
            >
                <div className={"main-content"}>
                    <div className={"container cancelPledgeContainer"}>
                        <PledgeCancelForm
                            onSubmit={this.handleSubmit}
                            error={this.state.error ? this.state.error : ''}
                            loading={this.state.loading}
                        />
                    </div>
                </div>
            </Page>
        );
    }
}

export default connect((reduxState) => ({
    pledge: reduxState.main.pledge.pledge,
    error: reduxState.main.pledge.error,
}))(PledgeCancel);
