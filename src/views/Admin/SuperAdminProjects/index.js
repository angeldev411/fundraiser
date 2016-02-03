/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { Link } from 'react-router';
import * as constants from '../../../common/constants';

/* Then React components */
import Page from '../../../components/Page';
import AdminLayout from '../../../components/AdminLayout';
import ProjectsTable from '../../../components/ProjectsTable';
import ModalButton from '../../../components/ModalButton';
import AdminProjectForm from '../../../components/AdminProjectForm';

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
        const projects = [];

        // Create array of projects
        for (let i = 0; i < 20; i++) {
            projects.push(project);
        }

        return (
            <Page>
                <AdminLayout>
                    <div className="content-header">
                        <h1 className="uppercase">{'Projects'}</h1>
                        <ModalButton type="btn-link pull-right uppercase"
                            content={<AdminProjectForm title={"New Project"}/>}
                        >
                            {'New project'}
                        </ModalButton>
                        <hr/>
                        <p>
                            {'Keep an eye on everyone on your team and watch their individual progress grow.'}
                        </p>
                    </div>
                    <ProjectsTable projects={projects} />
                </AdminLayout>
            </Page>
        );
    }
}

SuperAdminProjects.propTypes = {
    show: React.PropTypes.bool,
};
