/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../../components/Page';
import ProjectsTable from '../../../components/ProjectsTable';
import ModalButton from '../../../components/ModalButton';
import AdminLayout from '../../../components/AdminLayout';
import AdminProjectForm from '../../../components/AdminProjectForm';
import AdminContentHeader from '../../../components/AdminContentHeader';

const project = {
    name: 'Habitat For Humanity',
    slug: 'sample-project',
    projectAdminEmail: 'jane.doe@gmail.com',
    teams: [
        {
            name: 'York Division',
            slug: 'york-division',
            raised : 2500,
            pledge: 150,
            pledgePerHour : 5,
        },
        {
            name: 'York Division',
            slug: 'york-division',
            raised : 2500,
            pledge: 150,
            pledgePerHour : 5,
        },
    ],
};

export default class SuperAdminProjects extends Component {
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

        const projects = [];

        // Create array of projects
        for (let i = 0; i < 20; i++) {
            projects.push(project);
        }

        return (
            <Page>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader title={'Projects'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                        buttons={
                            <ModalButton type="btn-link pull-right uppercase"
                                content={<AdminProjectForm title={"Add New Project"}/>}
                            >
                                {'New project'}
                            </ModalButton>
                        }
                    />
                    <ProjectsTable projects={projects} />
                </AdminLayout>
            </Page>
        );
    }
}

SuperAdminProjects.propTypes = {
    show: React.PropTypes.bool,
};
