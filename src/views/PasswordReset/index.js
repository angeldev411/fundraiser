/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/user/actions';

/* Then React components */
import Page from '../../components/Page';
import Button from '../../components/Button';
import PasswordResetForm from '../../components/PasswordResetForm';

class PasswordReset extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            reseted: false,
        };
    }

    componentWillMount() {
        document.title = `Reset your password | Raiserve`;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            this.setState({
                loading: false,
                reseted: true,
            });
        } else if (nextProps.error) {
            this.setState({
                error: nextProps.error,
                loading: false,
            });
        }
    }

    submit = (data) => {
        this.setState({
            loading: true,
        });

        Actions.resetPassword(data)(this.props.dispatch);
    };

    render() {
        if (this.state.reseted) {
            return (
                <Page noHeader={true}
                    bodyBackground={{ backgroundColor: 'black' }}
                >
                    <div className={"main-content"}>
                        <div className={"container passwordResetContainer"}>
                            <h2>{'Your password has been reseted'}</h2>
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
                    <div className={"container passwordResetContainer"}>
                        <PasswordResetForm
                            onSubmit={this.submit}
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
    user: reduxState.main.user.user,
    error: reduxState.main.user.error,
}))(PasswordReset);
