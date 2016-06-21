/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as Actions from '../../../redux/sponsor/actions';
import { connect } from 'react-redux';
/* Then React components */
import Page from '../../../components/Page';
import AdminSponsorsTable from '../../../components/AdminSponsorsTable';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import lodash from 'lodash';


class AdminSponsors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sponsors: [],
            sortBy: null,
            ASC: true,
        };
    }

    componentWillMount() {
        document.title = 'Sponsors | raiserve';

        if (this.props.user) {
            this.doAction(this.props.user);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        } else if (nextProps.sponsors) {
            this.setState(
                {
                    sponsors: nextProps.sponsors,
                    error: null,
                }
            );
        } else if (nextProps.user) {
            this.doAction(nextProps.user);

            this.setState(
                {
                    user: nextProps.user,
                    error: null,
                }
            );
        }
    }

    doAction = ((user) => {
        const roles = user.roles;

        if (roles.indexOf('SUPER_ADMIN') >= 0) {
            Actions.indexSponsors()(this.props.dispatch);
        } else if (roles.indexOf('PROJECT_LEADER') >= 0) {
            const projectSlug = user.project.slug;

            Actions.indexSponsors(projectSlug)(this.props.dispatch);
        }
    });

    onSort = (column) => {
        let sponsors = lodash.sortBy(this.state.sponsors, (sponsor) => {
            return sponsor[column].toString().toLowerCase();
        });

        if (!this.state.ASC) {
            sponsors = lodash.reverse(sponsors);
        }

        this.setState({
            sortBy: column,
            ASC: !this.state.ASC,
            sponsors,
        });
    };

    render() {
        if (!this.props.user) {
            return (null);
        }

        let header = null;

        if (this.props.user.roles.indexOf('PROJECT_LEADER') >= 0) {
            header = `${this.props.user.project.name} Sponsors`;
        } else {
            header = `Sponsors`;
        }

        return (
            <Page>
                <AdminLayout>
                    <AdminContentHeader title={header}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <AdminSponsorsTable
                        sponsors={this.state.sponsors}
                        onSort={this.onSort}
                    />
                </AdminLayout>
            </Page>
        );
    }
}

AdminSponsors.propTypes = {
    show: React.PropTypes.bool,
};

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    error: reduxState.main.sponsor.error,
    sponsors: reduxState.main.sponsor.sponsors,
}))(AdminSponsors);
