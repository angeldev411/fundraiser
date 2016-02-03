import React, { Component } from 'react';
import * as constants from '../../common/constants';


export default class TeamLine extends Component {
    render() {
        return (
            <li className="team">
                <span className="label uppercase">Team Name: </span> {this.props.team.name}
                <span className="label uppercase">Raised: </span> ${this.props.team.raised}
                <span className="label uppercase">Average Pledge: </span> ${this.props.team.pledge}
                <span className="label uppercase">$ / HR: </span> ${this.props.team.pledgePerHour} / hr
                <div className="edit-links">
                    <a href="#"
                        className={'uppercase'}
                    >{'Edit'}</a>
                    <a href="#"
                        className={'uppercase'}
                    >{'Remove'}</a>
                    <a href="#"
                        className={'uppercase'}
                    >{'Invite Leader'}</a>
                </div>
            </li>
        );
    }
}

TeamLine.propTypes = {
    team: React.PropTypes.object,
};
