import React, { Component } from 'react';
import VolunteerProfileBlock from '../../components/VolunteerProfileBlock';
import PledgeButton from '../PledgeButton';
import EditButton from '../EditButton';
import EditCoverForm from '../EditCoverForm';
import EditTaglineForm from '../EditTaglineForm';
import * as constants from '../../common/constants';
import moment from 'moment';

const MOBILE_ACTIVATION_WIDTH = 992;
const HUGE_DESKTOP_WIDTH = 1400;

export default class Cover extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDesktop: window.innerWidth >= MOBILE_ACTIVATION_WIDTH,
            team: this.props.team,
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.SET_IS_DESKTOP);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.team && !this.state.team.cover) {
            this.setState({
                team: nextProps.team,
            });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.SET_IS_DESKTOP);
    }

    SET_IS_DESKTOP = () => {
        this.setState({
            isDesktop: window.innerWidth >= MOBILE_ACTIVATION_WIDTH,
            isHugeDesktop: window.innerWidth >= HUGE_DESKTOP_WIDTH,
        });
    };

    updateTeam = (team) => {
        this.setState({
            team,
        });
    };

    deadline() {
      return moment(this.props.team.deadline).format('MMM DD YYYY');
    }

    render() {
        const style = {
            backgroundImage : `url(${this.state.team && this.state.team.cover || this.props.image || `${constants.TEAM_IMAGES_FOLDER}/${constants.DEFAULT_COVER}` })`,
        };
        if (!style.backgroundImage.match(constants.DEFAULT_COVER)) {
            let size = constants.RESIZE_COVER_MD;

            if (this.state.isDesktop) size = constants.RESIZE_COVER_LG;
            if (this.state.isHugeDesktop) size = constants.RESIZE_COVER_XL;

            style.backgroundImage = `url(${size}${this.state.team.coverImage})`;
        }
        let COVERCONTENT = null;

        if (this.props.customclass === 'cover-volunteer-profile') {
            return (
                <div>
                    <div className={`cover ${this.props.customclass}`}
                        style={style}
                    >
                        <div className="cover-container">
                            <div className={"cover-content"}>
                                <div className="team-tagline">
                                    <div className="container">
                                        <div className="col-xs-12">
                                            <p>{this.props.tagline}</p>
                                        </div>
                                    </div>
                                </div>
                                <PledgeButton
                                    customClass="btn-default"
                                    volunteerSlug={this.props.volunteer.slug}
                                    goal={this.props.volunteer.goal}
                                    deadline={ this.deadline() }

                                    volunteer={this.props.volunteer}
                                    team={this.props.team}
                                    project={this.props.project}

                                    onPledgeSuccess={this.props.onPledgeSuccess}
                                >
                                    {this.props.button}
                                </PledgeButton>
                            </div>
                        </div>
                    </div>
                    <VolunteerProfileBlock
                      volunteer={this.props.volunteer}
                      project={this.props.project}
                      team={this.props.team}
                      totalSponsors={this.props.totalVolunteerSponsors}
                    />
                </div>
            );
        } else if (this.props.customclass === 'cover-team-profile') {
            COVERCONTENT = (
                <div>
                    <div className={"cover-content"}>
                        <div className="team-tagline">
                            <div className="container">
                                <div className="col-xs-12">
                                    <p>{this.props.tagline}</p>
                                </div>
                            </div>
                        </div>
                        {this.props.editable ?
                            <EditButton
                                direction="top"
                                name="tagline"
                                content={
                                    <EditTaglineForm
                                        value={this.props.tagline}
                                        team={this.props.team}
                                    />
                                }
                            >
                                {'Tagline'}
                            </EditButton>
                        : null}
                        <PledgeButton
                            customClass="btn-default"
                            teamSlug={this.props.team.slug}
                            goal={this.props.team.goal}
                            deadline={ this.deadline() }

                            team={this.props.team}
                            project={this.props.project}

                            onPledgeSuccess={this.props.onPledgeSuccess}
                        >
                            {this.props.button}
                        </PledgeButton>
                        {this.props.editable ?
                            <EditButton
                                direction="right"
                                name="cover"
                                content={
                                    <EditCoverForm
                                        value={this.props.image}
                                        team={this.props.team}
                                        updateTeam={this.updateTeam}
                                    />
                                }
                            >
                                {'Cover'}
                            </EditButton>
                        : null}
                    </div>
                </div>
            );
        } else if (this.props.customclass === 'cover-signup') {
            COVERCONTENT = (
                <div className={"cover-content container"}>
                    <div className={"logo col-xs-12 col-md-3"}>
                        <span className={"helper"}></span>
                        <img src={this.props.logo || `${constants.RAISERVE_LOGO}`}/>
                    </div>
                    <div className="team-tagline col-xs-12 col-md-9">
                        <h1 className={'uppercase'}>{`Welcome to the Team ${this.props.teamName}`}</h1>
                        <p>{this.props.tagline}</p>
                    </div>
                     {this.props.children}
                </div>
            );
        }

        return (
            <div className={`cover ${this.props.customclass}`}
                style={style}
            >
                <div className="cover-container">
                    {COVERCONTENT}
                </div>
            </div>
        );
    }
}

Cover.propTypes = {
    image: React.PropTypes.string,
    customclass: React.PropTypes.string,
    tagline: React.PropTypes.string,
    team: React.PropTypes.object,
    project: React.PropTypes.object,
    button: React.PropTypes.string,
    logo: React.PropTypes.string,
    volunteer: React.PropTypes.object,
    pathname: React.PropTypes.string,
    editable: React.PropTypes.bool,
    onPledgeSuccess: React.PropTypes.func,
    totalVolunteerSponsors: React.PropTypes.number
};
