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
    }

    componentWillMount() {
        document.title = 'Admin & Settings | Raiserve';
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        }
        if (nextProps.user) {
            this.setState(
                {
                    user: nextProps.user,
                }
            );
        }
    }
    executeMonthlyPayments = () =>{
      AdminActions.executeMonthlyPayments()(this.props.dispatch);  
    };
    
    render() {
        return (
            <Page>
                <AdminLayout>
                    <AdminContentHeader title={'Admin & Settings'}
                        description={'Do super user stuff like you know you want to.'}
                    />
                     <div>
                            <Button
                                customClass="btn-green-white btn-lg"
                                onClick={this.executeMonthlyPayments}
                            >
                                Run Monthly Payment Script
                            </Button>
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
    user: reduxState.main.auth.user
}))(AdminSettings);
