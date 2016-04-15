import React, { Component } from 'react';
import CollapsableLine from '../CollapsableLine';
import ChildrenLine from '../ChildrenLine';
import AdminProjectForm from '../AdminProjectForm';
import AdminTeamForm from '../AdminTeamForm';
import ModalButton from '../ModalButton';

export default class AdminProjectsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: this.props.projects,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.projects) {
            this.setState({
                projects: nextProps.projects,
            });
        }
    }

    newTeam = (team, projectIndex) => {
        const newState = Object.assign({}, this.state);

        newState.projects[projectIndex].teams.unshift(team);
        this.setState(newState);
    };

    updateTeam = (team, teamIndex, projectIndex) => {
        const newState = Object.assign({}, this.state);

        newState.projects[projectIndex].teams[teamIndex] = team;
        this.setState(newState);
    };

    updateProject = (project, projectIndex) => {
        const newState = Object.assign({}, this.state);

        newState.projects[projectIndex] = project;
        this.setState(newState);
    };

    handleSort = (column) => {
        this.props.onSort(column);
    };

    render() {
        console.log(this.props.user);


        return (
            <div className="projects-table">
                <ul className="projects">
                    {this.state.projects.map((project, i) => (
                        <CollapsableLine key={i}
                            childrenContent={
                                <ul className="children-content clearfix">
                                    {project.teams ? project.teams.map((team, x) => (
                                        <ChildrenLine key={x}>
                                            <div className={'col-xs-12'}>
                                                <div className={'col-xs-3'}>
                                                    <span>
                                                        <span className="label uppercase">{'Team Name: '}</span>
                                                        {(
                                                            this.props.user
                                                            && this.props.user.roles.indexOf('SUPER_ADMIN') >= 0
                                                            && team.fakeLeaderId
                                                        ) ?
                                                            <a className={'nostyle'} href={`/api/v1/auth/switch/${team.fakeLeaderId}`}>{team.name}</a> :
                                                            <span>{team.name}</span>
                                                        }
                                                    </span>
                                                </div>
                                                <div className={'col-xs-2'}>
                                                    <span className="label uppercase">{'Raised: '}</span> {team.raised ? team.raised : 0}
                                                </div>
                                                <div className={'col-xs-2'}>
                                                    <span className="label uppercase">{'Average Pledge: '}</span> {team.pledge ? team.pledge : 0}
                                                </div>
                                                <div className={'col-xs-2'}>
                                                    <span className="label uppercase">{'$ / HR: '}</span> {team.pledgePerHour ? team.pledgePerHour : 0} {'/ hr'}
                                                </div>
                                                <div className={'col-xs-3 edit-links'}>
                                                    <ModalButton customClass="btn-link uppercase"
                                                        content={
                                                            <AdminTeamForm
                                                                title={"Edit team"}
                                                                defaultData={{
                                                                    project,
                                                                    team,
                                                                }}
                                                                updateTeam={(team, teamIndex) => {
                                                                    this.updateTeam(team, x, i);
                                                                }}
                                                            />
                                                        }
                                                    >
                                                        {'Edit'}
                                                    </ModalButton>
                                                    <ModalButton customClass="btn-link uppercase"
                                                        content={
                                                            <AdminTeamForm
                                                                title={"Edit team"}
                                                                defaultData={{
                                                                    project,
                                                                    team,
                                                                }}
                                                                updateTeam={(team, teamIndex) => {
                                                                    this.updateTeam(team, x, i);
                                                                }}
                                                            />
                                                        }
                                                    >
                                                        {'Invite Leader'}
                                                    </ModalButton>
                                                </div>
                                            </div>
                                        </ChildrenLine>
                                    )) : null}
                                </ul>
                            }
                        >
                            <div className="project-details">
                                <div className={'col-xs-8'}>
                                    <span>
                                        <span
                                            className="label uppercase"
                                            onClick={() => {
                                                this.handleSort('name')
                                            }}
                                        >{'Project Name: '}</span>
                                        {(
                                            this.props.user
                                            && this.props.user.roles.indexOf('SUPER_ADMIN') >= 0
                                            && project.fakeLeaderId
                                        ) ?
                                            <a className={'nostyle'} href={`/api/v1/auth/switch/${project.fakeLeaderId}`}>{project.name}</a> :
                                            <span>{project.name}</span>
                                        }
                                    </span>
                                </div>
                                <div className={'col-xs-3'}>
                                    <ModalButton customClass="btn-link uppercase"
                                        content={
                                            <AdminProjectForm title={"Edit Project"}
                                                defaultData={project}
                                                updateProject={(project) => {
                                                    this.updateProject(project, i);
                                                }}
                                            />
                                        }
                                    >
                                        {'Edit Project'}
                                    </ModalButton>
                                    <ModalButton customClass="btn-link uppercase"
                                        content={
                                            <AdminTeamForm
                                                title={"Add New Team"}
                                                defaultData={{
                                                    project,
                                                }}
                                                newTeam={(team) => {
                                                    this.newTeam(team, i);
                                                }}
                                            />
                                        }
                                    >
                                        {'New Team'}
                                    </ModalButton>
                                </div>
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
    onSort: React.PropTypes.func,
    user: React.PropTypes.object,
};
