import React, { Component } from 'react';
import * as constants from '../../common/constants';
import TeamLine from '../TeamLine';
import AdminProjectForm from '../AdminProjectForm';
import AdminNewTeamForm from '../AdminNewTeamForm';
import ModalButton from '../ModalButton';

export default class ProjectLine extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: true,
        };
    }

    toggle = () => {
        this.setState({collapsed: !this.state.collapsed});
    };

    render() {
        return (
            <li className="project clearfix">
                <div className="project-details">
                    <span className="project-name uppercase">Project Name: </span> {this.props.project.name}
                    <ModalButton type="btn-link uppercase"
                        content={
                            <AdminProjectForm title={"New Project"}
                                project={this.props.project}
                            />
                        }
                    >
                        {'Edit Project'}
                    </ModalButton>
                    <ModalButton type="btn-link uppercase"
                        content={<AdminNewTeamForm project={this.props.project} />}
                    >
                        {'New Team'}
                    </ModalButton>
                    <button
                        className={'expand btn-link pull-right'}
                        onClick={this.toggle}
                    >{this.state.collapsed ? '+' : '-'}</button>
                </div>
                {
                    this.state.collapsed ?
                    (null) :
                    (
                        <ul className="teams clearfix">
                            {this.props.project.teams.map((team, i) => (
                                <TeamLine key={i}
                                    team={team}
                                />)
                            )}
                        </ul>
                    )
                }
            </li>
        );
    }
}

ProjectLine.propTypes = {
    project: React.PropTypes.object,
};
