import React, { Component } from 'react';
import Layout34 from '../Layout34';
import EditButton from '../EditButton';
import * as constants from '../../common/constants';


export default class TeamProfileBlock extends Component {
    render() {
        return (
            <div className={"container"}>
                <Layout34 page={'team-profile'}>
                    <img id="team-logo"
                        src={`${constants.TEAM_IMAGES_FOLDER}/${this.props.team.uniqid}/${this.props.team.logo}`}
                        title=""
                    />
                    {this.props.editable ?
                        <EditButton
                            direction="left"
                            name="logo"
                        >
                            {'Logo'}
                        </EditButton>
                    : null}
                    {this.props.volunteerprofile
                        ? (null)
                        : (
                        <div>
                            <div className={'team-slogan'}>
                                {this.props.team.slogan}
                            </div>
                            {this.props.editable ?
                                (<EditButton
                                    direction="top"
                                    name="slogan"
                                 >
                                    {'Slogan'}
                                </EditButton>)
                            : null}
                        </div>
                        )
                    }
                    <h1>{this.props.team.name}</h1>
                    <p>
                        {this.props.team.description}
                    </p>
                    {this.props.editable ?
                        <EditButton
                            direction="left"
                            name="description"
                        >
                            {'Description'}
                        </EditButton>
                    : null}
                </Layout34>
            </div>
        );
    }
}

TeamProfileBlock.propTypes = {
    team: React.PropTypes.object,
    volunteerprofile: React.PropTypes.bool,
    editable: React.PropTypes.bool,
};
