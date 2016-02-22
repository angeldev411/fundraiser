import React, { Component } from 'react';
import CollapsableLine from '../CollapsableLine';
import ChildrenLine from '../ChildrenLine';
import AdminProjectForm from '../AdminProjectForm';
import AdminTeamForm from '../AdminTeamForm';
import ModalButton from '../ModalButton';
import * as Actions from '../../redux/project/actions';
import { connect } from 'react-redux';

class AdminProjectsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: []
        };
    }

    componentWillMount() {
        Actions.indexProjects()(this.props.dispatch);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        } else if (nextProps.projects) {
            this.setState(
                {
                    projects: nextProps.projects,
                    error: null,
                }
            );
        }
    }

    render() {
        return (
            <div className="projects-table">
                <ul className="projects">
                    {this.state.projects.map((project, i) => (
                        <CollapsableLine key={i}
                            childrenContent={
                                <ul className="children-content clearfix">
                                    {project.teams.map((team, x) => (
                                        <ChildrenLine key={x}>
                                            <span className="label uppercase">Team Name: </span> {team.name}
                                            <span className="label uppercase">Raised: </span> {team.raised}
                                            <span className="label uppercase">Average Pledge: </span> {team.pledge}
                                            <span className="label uppercase">$ / HR: </span> {team.pledgePerHour} / hr
                                            <div className="edit-links">
                                                <ModalButton customClass="btn-link uppercase"
                                                    content={
                                                        <AdminTeamForm title={"Edit team"}
                                                            project={project}
                                                            team={team}
                                                        />
                                                    }
                                                >
                                                    {'Edit'}
                                                </ModalButton>
                                                <a href="#"
                                                    className={'uppercase'}
                                                >{'Remove'}</a>
                                                <a href="#"
                                                    className={'uppercase'}
                                                >{'Invite Leader'}</a>
                                            </div>
                                        </ChildrenLine>
                                    ))}
                                </ul>
                            }
                        >
                            <div className="project-details">
                                <span className="label uppercase">Project Name: </span> {project.name}
                                <ModalButton customClass="btn-link uppercase"
                                    content={
                                        <AdminProjectForm title={"Edit Project"}
                                            project={project}
                                        />
                                    }
                                >
                                    {'Edit Project'}
                                </ModalButton>
                                <ModalButton customClass="btn-link uppercase"
                                    content={
                                        <AdminTeamForm title={"Add New Team"}
                                            project={project}
                                        />
                                    }
                                >
                                    {'New Team'}
                                </ModalButton>
                            </div>
                        </CollapsableLine>
                    ))}
                </ul>
            </div>
        );
    }
}

AdminProjectsTable.propTypes = {
    projects: React.PropTypes.array,
};

export default connect((reduxState) => ({
    error: reduxState.main.project.error,
    projects: reduxState.main.project.projects,
}))(AdminProjectsTable);
