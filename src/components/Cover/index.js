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
                            <p>{this.props.tagline}</p>
                        </div>
                    </div>
                    <div className={"cover-content container"}>
                        <Button type="btn-default">
                            {this.props.button}
                        </Button>
                    </div>
                </div>
            );
        } else if (this.props.customclass === 'cover-signup') {
            COVERCONTENT = (
                <div>
                    <div className={"cover-content container"}>
                        <div className={"logo"}>
                            <span className={"helper"}></span>
                            <img src={this.props.logo}/>
                        </div>
                        <div className="team-tagline">
                            <h2>{"Welcome to the Team"}</h2>
                            <p>{this.props.tagline} {this.props.tagline} {this.props.tagline}</p>
                        </div>
                    </div>
                </div>
            );
        } else {
            COVERCONTENT = (
                <div className={"cover-content container"}>
                    <h2 className="tagline">{this.props.tagline}</h2>
                    <Button type="btn-default">
                        {this.props.button}
                    </Button>
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
