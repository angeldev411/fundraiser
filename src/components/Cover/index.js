import React, { Component } from 'react';
import VolunteerProfileBlock from '../../components/VolunteerProfileBlock';
import PledgeButton from '../PledgeButton';
import EditButton from '../EditButton';
import EditCoverForm from '../EditCoverForm';
import EditTaglineForm from '../EditTaglineForm';
import * as constants from '../../common/constants';

export default class Cover extends Component {
    constructor(props) {
        super(props);

        const MOBILE_ACTIVATION_WIDTH = 992;

        this.state = {
            isDesktop: window.innerWidth >= MOBILE_ACTIVATION_WIDTH,
        };

        window.addEventListener('resize', this.SET_IS_DESKTOP);
    }

    SET_IS_DESKTOP = () => {
        this.setState({
            isDesktop: window.innerWidth >= MOBILE_ACTIVATION_WIDTH,
        });
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.SET_IS_DESKTOP);
    }

    render() {
        const style = {
            backgroundImage : `url(${this.props.image || `${constants.TEAM_IMAGES_FOLDER}/${constants.DEFAULT_COVER}` })`,
        };

        let COVERCONTENT = null;

        if (!this.state.isDesktop && this.props.customclass === 'cover-volunteer-profile') {
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
                                >
                                    {this.props.button}
                                </PledgeButton>
                            </div>
                        </div>
                    </div>
                    <VolunteerProfileBlock
                        volunteer={this.props.volunteer}
                        pathname={this.props.pathname}
                        team={this.props.team}
                    />
                </div>
            );
        }

        if (this.props.customclass === 'cover-volunteer-profile') {
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
                        <PledgeButton
                            customClass="btn-default"
                            volunteerSlug={this.props.volunteer.slug}
                        >
                            {this.props.button}
                        </PledgeButton>
                        <VolunteerProfileBlock
                            volunteer={this.props.volunteer}
                            team={this.props.team}
                            pathname={this.props.pathname}
                        />
                    </div>
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
                                <EditButton
                                    direction="left"
                                    name="tagline"
                                    content={
                                        <EditTaglineForm
                                            value={this.props.tagline}
                                        />
                                    }
                                >
                                    {'Tagline'}
                                </EditButton>
                            </div>
                        </div>
                        <PledgeButton
                            customClass="btn-default"
                            teamSlug={this.props.team.slug}
                            oneTimeOnly
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
                        <img src={this.props.logo || `${constants.TEAM_IMAGES_FOLDER}/${constants.DEFAULT_LOGO}`}/>
                    </div>
                    <div className="team-tagline col-xs-12 col-md-9">
                        <h1 className={'uppercase'}>{"Welcome to the Team"}</h1>
                        <p>{this.props.tagline}</p>
                    </div>
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
    button: React.PropTypes.string,
    logo: React.PropTypes.string,
    volunteer: React.PropTypes.object,
    pathname: React.PropTypes.string,
    editable: React.PropTypes.bool,
};
