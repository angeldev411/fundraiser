import React, { Component } from 'react';
import Layout34 from '../Layout34';
import * as constants from '../../common/constants';


export default class TeamProfileBlock extends Component {
    render() {
        if (this.props.volunteerprofile) {
            return (
                <div className={"container"}>
                    <Layout34 page={'team-profile'}>
                        <img id="team-logo"
                            src={`${constants.TEAM_IMAGES_FOLDER}/${this.props.team.uniqid}/${this.props.team.logo}`}
                            title=""
                        />
                        <h1>{this.props.team.name}</h1>
                        <p>
                            {this.props.team.description}
                        </p>
                    </Layout34>
                </div>
            );
        }

        return (
            <div className={"container"}>
                <Layout34 page={'team-profile'}>
                    <img id="team-logo"
                        src={`${constants.TEAM_IMAGES_FOLDER}/${this.props.team.uniqid}/${this.props.team.logo}`}
                        title=""
                    />
                    <div className={'team-slogan'}>{this.props.team.slogan}</div>
                    <h1>{this.props.team.name}</h1>
                    <p>
                        {this.props.team.description}
                    </p>
                </Layout34>
            </div>
        );
    }
}

TeamProfileBlock.propTypes = {
    team: React.PropTypes.object,
    volunteerprofile: React.PropTypes.bool,
};
