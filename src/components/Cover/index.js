import React, { Component } from 'react';
import Button from '../../components/Button';

export default class Cover extends Component {
    render() {
        const style = {
            backgroundImage : this.props.image,
        };

        let COVERCONTENT = null;

        if (this.props.customclass === 'cover-profile') {
            COVERCONTENT = (
                <div>
                    <div className="team-tagline">
                        <div className="container">
                            <div className="col-xs-12">
                                <p>{this.props.tagline}</p>
                                </div>
                            </div>
                        </div>
                    <div className={"cover-content container"}>
                        <div className="col-xs-12">
                            <Button type="btn-default">
                                {this.props.button}
                            </Button>
                        </div>
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
                        <h2>{"Welcome to the Team"}</h2>
                        <p maxLength={10}>{this.props.tagline} {this.props.tagline} {this.props.tagline}</p>
                    </div>
                </div>
            );
        } else {
            COVERCONTENT = (
                <div className={"cover-content container"}>
                    <div className="col-xs-12">
                        <h2 className="tagline">{this.props.tagline}</h2>
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
                {COVERCONTENT}
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
};
