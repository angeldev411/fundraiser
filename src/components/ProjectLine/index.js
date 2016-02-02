import React, { Component } from 'react';
import * as constants from '../../common/constants';
import TeamLine from '../TeamLine';

export default class ProjectLine extends Component {
    render() {
        return (
            <li className="project">
                <div className="project-details">
                    <span className="project-name uppercase">Project Name: </span> {this.props.project.name}
                    <a href="#"
                        className={'uppercase'}
                    >{'Edit Project'}</a>
                    <a href="#"
                        className={'uppercase'}
                    >{'New Team'}</a>
                    <a href="#"
                        className={'expand pull-right'}
                    >{'+'}</a>
                </div>
                <ul className="teams clearfix">
                    {this.props.project.teams.map((team, i) => (
                        <TeamLine key={i}
                            team={team}
                        />)
                    )}
                </ul>
            </li>
        );
    }
}

ProjectLine.propTypes = {
    project: React.PropTypes.object,
};
