import React, { Component } from 'react';
import Button from '../../components/Button';
import VolunteerProfileBlock from '../../components/VolunteerProfileBlock';
import PledgeButton from '../PledgeButton/';

export default class Cover extends Component {
    constructor(props) {
        super(props);

        const MOBILE_ACTIVATION_WIDTH = 992;

        this.state = {
            isDesktop: window.innerWidth >= MOBILE_ACTIVATION_WIDTH,
        };

        window.addEventListener('resize', () => {
            this.setState({
                isDesktop: window.innerWidth >= MOBILE_ACTIVATION_WIDTH,
            });
        });
    }

    render() {
        const style = {
            backgroundImage : this.props.image,
        };

        let COVERCONTENT = null;

        if (!this.state.isDesktop && this.props.customclass === 'cover-volunteer-profile') {
            return (
                <div>
                    <div className={`cover ${this.props.customclass}`}
                        style={style}
                    >
                        <div className={"cover-content"}>
                            <div className="team-tagline">
                                <div className="container">
                                    <div className="col-xs-12">
                                        <p>{this.props.volunteer.team.tagline}</p>
                                    </div>
                                </div>
                            </div>
                            <PledgeButton type="btn-default">
                                {this.props.button}
                            </PledgeButton>
                        </div>
                    </div>
                    <VolunteerProfileBlock volunteer={this.props.volunteer}
                        pathname={this.props.pathname}
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
                                    <p>{this.props.volunteer.team.tagline}</p>
                                </div>
                            </div>
                        </div>
                        <PledgeButton type="btn-default">
                            {this.props.button}
                        </PledgeButton>
                        <VolunteerProfileBlock volunteer={this.props.volunteer}
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
                            </div>
                        </div>
                        <PledgeButton type="btn-default">
                            {this.props.button}
                        </PledgeButton>
                    </div>
                </div>
            );
        } else if (this.props.customclass === 'cover-signup') {
            COVERCONTENT = (
                <div className={"cover-content container"}>
                    <div className={"logo col-xs-12 col-md-3"}>
                        <span className={"helper"}></span>
                        <img src={this.props.logo}/>
                    </div>
                    <div className="team-tagline col-xs-12 col-md-9">
                        <h1 className={'uppercase'}>{"Welcome to the Team"}</h1>
                        <p maxLength={10}>{this.props.tagline} {this.props.tagline} {this.props.tagline}</p>
                    </div>
                </div>
            );
        } else {
            COVERCONTENT = (
                <div className={"cover-content container"}>
                    <div className="col-xs-12">
                        <h1 className="tagline uppercase">{this.props.tagline}</h1>
                        <Button type="btn-default">
                            {this.props.button}
                        </Button>
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
    button: React.PropTypes.string,
    logo: React.PropTypes.string,
    volunteer: React.PropTypes.object,
    pathname: React.PropTypes.string,
};
