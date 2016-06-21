/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as Actions from '../../../redux/project/actions';
import { connect } from 'react-redux';

/* Then React components */
import Page from '../../../components/Page';
import AdminProjectsTable from '../../../components/AdminProjectsTable';
import ModalButton from '../../../components/ModalButton';
import AdminLayout from '../../../components/AdminLayout';
import AdminProjectForm from '../../../components/AdminProjectForm';
import AdminContentHeader from '../../../components/AdminContentHeader';
import lodash from 'lodash';

class AdminProjects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            sortBy: null,
            ASC: true,
        };
    }

    componentWillMount() {
        document.title = 'Edit projects | raiserve';

        Actions.indexProjects()(this.props.dispatch);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        }
        if (nextProps.projects) {
            this.setState(
                {
                    projects: nextProps.projects,
                    error: null,
                }
            );
        }
        if (nextProps.user) {
            this.setState(
                {
                    user: nextProps.user,
                }
            );
        }
    }

    newProject = (project) => {
        const newState = Object.assign({}, this.state);

        newState.projects.unshift(project);
        this.setState(newState);
    };

    onSort = (column) => {
        let projects = lodash.sortBy(this.state.projects, (project) => {
            return project[column].toString().toLowerCase();
        });

        if (!this.state.ASC) {
            projects = lodash.reverse(projects);
        }

        this.setState({
            sortBy: column,
            ASC: !this.state.ASC,
            projects,
        });
    };

    render() {
        const pageNav = [
            {
                type: 'button',
                title: 'Add New Project',
                content:
                    <AdminProjectForm
                        title={"Add New Project"}
                        newProject={this.newProject}
                    />,
            },
        ];

        return (
            <Page>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader title={'Projects'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                        buttons={
                            <ModalButton customClass="btn-link pull-right uppercase"
                                content={
                                    <AdminProjectForm
                                        title={"Add New Project"}
                                        newProject={this.newProject}
                                    />}
                            >
                                {'New project'}
                            </ModalButton>
                        }
                    />
                    <AdminProjectsTable
                        projects={this.state.projects}
                        onSort={this.onSort}
                        user={this.state.user}
                    />
                </AdminLayout>
            </Page>
        );
    }
}

AdminProjects.propTypes = {
    show: React.PropTypes.bool,
};

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    error: reduxState.main.project.error,
    projects: reduxState.main.project.projects,
}))(AdminProjects);
