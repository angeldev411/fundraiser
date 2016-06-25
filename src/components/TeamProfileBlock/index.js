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
        const full = 100;
        let percentage = (this.props.team.totalHours / this.props.team.goal) * full;

        let logoImage = (this.props.team.logo) ? this.props.team.logo : `${constants.TEAM_IMAGES_FOLDER}/${constants.DEFAULT_LOGO}`;

        if (!logoImage.match(constants.DEFAULT_LOGO)) {
            logoImage = constants.RESIZE_LOGO + logoImage;
        }

        if (percentage > full) {
            percentage = full;
        }

        return (
            <div
                className={"container"}
                id={'my-cause'}
            >
                <Layout34
                    team={this.props.team}
                    project={this.props.project}
                    page={'team-profile'}
                    volunteerprofile={this.props.volunteerprofile}
                >
                    <img id="team-logo"
                        src={logoImage}
                        title=""
                    />
                    <br/>
                    {this.props.editable ?
                        <EditButton
                            direction="top"
                            name="logo"
                            content={
                                <EditLogoForm
                                    value={
                                        this.state.team.logo ?
                                        this.state.team.logo :
                                        `${constants.TEAM_IMAGES_FOLDER}/${constants.DEFAULT_LOGO}`
                                    }
                                    team={this.props.team}
                                    updateTeam={this.updateTeam}
                                />
                            }
                        >
                            {'Logo'}
                        </EditButton>
                    : null}

                    {this.props.teamgoal
                        ? (
                        <div id="team-goal">
                            <span id="team-goal-title">{'TEAM GOAL'}</span>
                            <div
                                className="progress"
                            >
                                <div
                                    className="team-goal-bar progress-bar"
                                    role="progressbar"
                                    aria-valuenow={percentage}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    style={{ width: `${percentage}%` }}
                                >
                                    <span className="sr-only">{'60% Complete'}</span>
                                </div>
                            </div>
                            <div id="team-goal-number">
                                <span id="label">{'Goal'}</span>
                                <span id="value">{this.props.team.goal}{' hrs'}</span>
                            </div>
                            <p className={'clearfix'}>
                                {this.props.team.totalHours > 0 ? (<span>{Number(this.props.team.totalHours).toFixed(2)} Completed</span>) : ''}
                            </p>
                        </div>
                        )
                        : (null)
                    }

                    {this.props.volunteerprofile
                        ? (null)
                        : (
                        <div>
                            <div className={'team-slogan'}>
                                {`YOU + US = ${this.props.team.slogan}`}
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
                            ? (<span id={'team-link'} className={'hidden-xs'}>
                                <Link to={Urls.getTeamProfileUrl(this.props.project.slug, this.props.team.slug)}>
                                    {'View team profile'}
                                </Link>
                            </span>)
                            : null
                        }
                    </h1>
                    <h1 className={'hidden-sm hidden-md hidden-lg hidden-xl'}>
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
                            direction="top"
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
