import React, { Component } from 'react';
import Layout34 from '../Layout34';
import EditButton from '../EditButton';
import * as constants from '../../common/constants';
import * as Urls from '../../urls';
import { Link } from 'react-router';
import EditLogoForm from '../EditLogoForm';
import EditSloganForm from '../EditSloganForm';
import EditDescriptionForm from '../EditDescriptionForm';

export default class TeamProfileBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team: this.props.team,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.team && !this.state.team.logo) {
            this.setState({
                team: nextProps.team,
            });
        }
    }

    updateTeam = (team) => {
        this.setState({
            team,
        });
    };

    render() {
        return (
            <div className={"container"}>
                <Layout34
                    team={this.props.team}
                    project={this.props.project}
                    page={'team-profile'}
                >
                    <img id="team-logo"
                        src={
                            this.state.team.logo ?
                            this.state.team.logo :
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
                                    value={`${this.state.team.logo}`}
                                    team={this.state.team}
                                    updateTeam={this.updateTeam}
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
                                            team={this.props.team}
                                        />
                                    }
                                 >
                                    {'Slogan'}
                                </EditButton>)
                            : null}
                        </div>
                        )
                    }
                    <h1>
                        {this.props.team.name}
                        {this.props.volunteerprofile
                            ? (<span id={'team-link'}>
                                <Link to={Urls.getTeamProfileUrl(this.props.project.slug, this.props.team.slug)}>
                                    {'View team profile'}
                                </Link>
                            </span>)
                            : null
                        }
                    </h1>
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
                                    team={this.props.team}
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
    project: React.PropTypes.object,
    volunteerprofile: React.PropTypes.bool,
    editable: React.PropTypes.bool,
};
