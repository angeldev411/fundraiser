/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as AdminActions from '../../redux/admin/actions';
import { connect } from 'react-redux';

/* Then React components */
import Page from '../../components/Page';
import AdminLayout from '../../components/AdminLayout';
import AdminContentHeader from '../../components/AdminContentHeader';
import Button from '../../components/Button';

class AdminSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            
        };
    }

    componentWillMount() {
        document.title = 'Admin & Settings | Raiserve';
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.executeSuccess) {
            this.setState({ loading: false, success: nextProps.executeSuccess });
        } else if (nextProps.executeError) {
            this.setState(
                {
                    loading: false,
                    error: nextProps.executeError,
                }
            );
        } else if (nextProps.user) {
            this.setState(
                {
                    loading: false,
                    user: nextProps.user,
                }
            );
        }
    }
    executeMonthlyPayments = () =>{
      this.setState({
        loading: true,
      });
      AdminActions.executeMonthlyPayments()(this.props.dispatch);
    };
    
    executeResetCurrentHours = () =>{
      this.setState({
         loading: true,
      });
      AdminActions.executeResetHours()(this.props.dispatch);  
    };
    
    render() {
        return (
            <Page>
                <AdminLayout>
                    <AdminContentHeader title={'Admin & Settings'}
                        description={'Do super user stuff like you know you want to.'}
                    />
                     <div>
                            <p><Button
                                customClass="btn-green-white btn-lg"
                                onClick={this.executeMonthlyPayments}
                                disabled={this.state.loading}
                            >
                                Run Monthly Payment Script
                            </Button></p>
                            
                            {this.state.error ? <p>{this.state.error}</p> : null}
                        </div>
                </AdminLayout>
                                   
            </Page>
        );
    }
}

AdminSettings.propTypes = {
    show: React.PropTypes.bool,
};

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    executeError: reduxState.main.admin.error,
    executeSuccess: reduxState.main.admin.status,
}))(AdminSettings);
