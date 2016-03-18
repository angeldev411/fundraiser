/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/user/actions';

/* Then React components */
import Page from '../../components/Page';
import PasswordResetForm from '../../components/PasswordResetForm';

class PasswordReset extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
        };
    }

    componentWillMount() {
        document.title = `Reset your password | Raiserve`;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            this.setState({
                loading: false,
            });
            // TODO CONFIRMATION MESSAGE
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
        return (
            <Page noHeader={true}
                bodyBackground={{ backgroundColor: 'black' }}
            >
                <div className={"main-content"}>
                    <div className={"container"}>
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
