/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../../components/Page';
import AdminSponsorsTable from '../../../components/AdminSponsorsTable';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';

// TODO dynamic data
import * as data from '../../../common/test-data';
const sponsors = data.sponsors;

export default class AdminProjects extends Component {
    componentWillMount() {
        document.title = 'Sponsors | Raiserve';
    }

    render() {
        return (
            <Page>
                <AdminLayout>
                    <AdminContentHeader title={'Sponsors'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <AdminSponsorsTable sponsors={sponsors} />
                </AdminLayout>
            </Page>
        );
    }
}

AdminProjects.propTypes = {
    show: React.PropTypes.bool,
};
