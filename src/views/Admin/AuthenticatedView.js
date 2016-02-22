/* Import "logic" dependencies first */
import React, { Component } from 'react';
import RouteNotFound from '../RouteNotFound';
import Page from '../../components/Page';
import { connect } from 'react-redux';

class AuthenticatedView extends Component {
    render() {
        if (
            !this.props.user
            || (
                this.props.user.roles.indexOf(this.props.accessLevel) < 0
                && this.props.user.roles.indexOf('SUPER_ADMIN') < 0
            )
        ) {
            return (<RouteNotFound />);
        } else {
            return (
                <Page>
                    {this.props.children}
                </Page>
            );
        }
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
}))(AuthenticatedView);
