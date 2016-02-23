import React, { Component } from 'react';
import Layout34 from '../Layout34';
import EditButton from '../EditButton';
import * as constants from '../../common/constants';
import EditLogoForm from '../EditLogoForm';
import EditSloganForm from '../EditSloganForm';
import EditDescriptionForm from '../EditDescriptionForm';

export default class TeamProfileBlock extends Component {
    render() {
        return (
            <div className={"container"}>
                <Layout34 page={'team-profile'}>
                    <img id="team-logo"
                        src={
                            this.props.team.logo ?
                            `${constants.TEAM_IMAGES_FOLDER}/${this.props.team.id}/${this.props.team.logo}`:
                            `${constants.TEAM_IMAGES_FOLDER}/${constants.DEFAULT_LOGO}`
                        }
                        title=""
                    />
                    {this.props.editable ?
                        <EditButton
                            direction="left"
                            name="logo"
                            content={
                                <EditLogoForm
                                    value={`${constants.TEAM_IMAGES_FOLDER}/${this.props.team.id}/${this.props.team.logo}`}
                                />
                            }
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
                                    content={
                                        <EditSloganForm
                                            value={this.props.team.slogan}
                                        />
                                    }
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
                            content={
                                <EditDescriptionForm
                                    value={this.props.team.description}
                                />
                            }
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
