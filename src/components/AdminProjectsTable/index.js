import React, { Component } from 'react';
import * as constants from '../../common/constants';
import ProjectLine from '../ProjectLine';


export default class AdminProjectsTable extends Component {
    render() {
        return (
            <div className="projects-table">
                <ul className="projects">
                    {this.props.projects.map((project, i) => (
                        <ProjectLine key={i}
                            project={project}
                        />)
                    )}
                </ul>
            </div>
        );
    }
}

AdminProjectsTable.propTypes = {
    projects: React.PropTypes.array,
};
