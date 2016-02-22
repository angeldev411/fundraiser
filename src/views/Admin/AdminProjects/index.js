/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import AuthenticatedView from '../AuthenticatedView';
import AdminProjectsTable from '../../../components/AdminProjectsTable';
import ModalButton from '../../../components/ModalButton';
import AdminLayout from '../../../components/AdminLayout';
import AdminProjectForm from '../../../components/AdminProjectForm';
import AdminContentHeader from '../../../components/AdminContentHeader';

// TODO dynamic data
import * as data from '../../../common/test-data';
const projects = data.projects;

export default class AdminProjects extends Component {
    componentWillMount() {
        document.title = 'Edit projects | Raiserve';
    }

    render() {
        const pageNav = [
            {
                type: 'button',
                title: 'Add New Project',
                content: <AdminProjectForm title={"Add New Project"}/>,
            },
        ];

        return (
            <AuthenticatedView>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader title={'Projects'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                        buttons={
                            <ModalButton customClass="btn-link pull-right uppercase"
                                content={<AdminProjectForm title={"Add New Project"}/>}
                            >
                                {'New project'}
                            </ModalButton>
                        }
                    />
                    <AdminProjectsTable projects={projects} />
                </AdminLayout>
            </AuthenticatedView>
        );
    }
}

AdminProjects.propTypes = {
    show: React.PropTypes.bool,
};
