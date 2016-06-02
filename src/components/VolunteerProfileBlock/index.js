import React, { Component } from 'react';
import { Link } from 'react-router';
import * as Urls from '../../urls.js';
import * as constants from '../../common/constants';
import UserProgress from '../../components/UserProgress';

export default class VolunteerProfileBlock extends Component {
    render() {
        const SHARE_URL = `${constants.DOMAIN}${this.props.pathname}`;
        const SHARE_TEXT = `${this.props.volunteer.firstName} ${this.props.volunteer.lastName} from ${this.props.team.name} - Raiserve`;
        const SHARE_MESSAGE = `${this.props.volunteer.message}`;
        const SLOGAN = this.props.team.slogan || 'YOUR OBJECTIVE';
        
        return (
            <div className="volunteer-profile-block">
                <div className="container">
                    <div className={'col-xs-12 col-md-4 volunteer-picture'}>
                        <UserProgress user={this.props.volunteer}/>
                    </div>
                    <div className={'col-xs-12 col-md-8 volunteer-description'}>
                        <div className={'team-slogan'}>{`YOU + US = ${SLOGAN}`}</div>
                        <p>
                            {this.props.volunteer.description}
                        </p>
                        <div className="share-row">
                            <Link
                                to={Urls.RAISERVE_BASICS}
                                target="_blank"
                                className="link uppercase"
                            >
                                {'How It Works'}
                            </Link>
                            {
                                (this.props.project && this.props.team && this.props.volunteer) ?
                                    <Link to={`${Urls.getVolunteerProfileUrl(this.props.project.slug, this.props.team.slug, this.props.volunteer.slug)}#my-cause`}
                                        className="link uppercase"
                                    >
                                        {'My Cause'}
                                    </Link>
                                : null
                            }
                            <span className="uppercase">
                                {'Share my goal'}
                            </span>
                            <a href={`mailto:?subject=${SHARE_TEXT}&body=${SHARE_MESSAGE} - ${SHARE_URL}`}
                                className="share"
                            >
                                <i className="fa fa-envelope"/>
                            </a>
                            <a href={`https://www.facebook.com/sharer.php?u=${SHARE_URL}`}
                                target="_blank"
                                className="share"
                            >
                                <i className="fa fa-facebook"/>
                            </a>
                            <a href={`https://twitter.com/share?url=${SHARE_URL}&text=${SHARE_TEXT}&via=${constants.TWITTER_USERNAME}`}
                                target="_blank"
                                className="share"
                            >
                                <i className="fa fa-twitter"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

VolunteerProfileBlock.propTypes = {
    volunteer: React.PropTypes.object,
    project: React.PropTypes.object,
    team: React.PropTypes.object,
    pathname: React.PropTypes.string,
};
