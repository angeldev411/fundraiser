import React, { Component } from 'react';
import { Link } from 'react-router';
import * as Urls from '../../urls.js';

export default class VolunteerProfileBlock extends Component {
    render() {
        return (
            <div className="volunteer-profile-block">
                <div className="container">
                    <div className={'col-xs-12 col-md-4 volunteer-picture'}>
                    </div>
                    <div className={'col-xs-12 col-md-8 volunteer-description'}>
                        <div className={'team-slogan'}>{this.props.volunteer.team.slogan}</div>
                        <p>
                            {this.props.volunteer.message}
                        </p>
                        <div className="share-row">
                            <Link to={Urls.RAISERVEBASICS}
                                className="link uppercase"
                            >
                                {'How It Works'}
                            </Link>
                            <span className="uppercase">
                                {'Share my goal'}
                            </span>
                            <Link to="#"
                                className="share"
                            >
                                <i className="fa fa-envelope"/>
                            </Link>
                            <Link to="#"
                                className="share"
                            >
                                <i className="fa fa-facebook"/>
                            </Link>
                            <Link to="#"
                                className="share"
                            >
                                <i className="fa fa-twitter"/>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

VolunteerProfileBlock.propTypes = {
    volunteer: React.PropTypes.object,
};
