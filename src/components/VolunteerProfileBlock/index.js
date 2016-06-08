import React, { Component } from 'react';
import { Link } from 'react-router';
import * as Urls from '../../urls.js';
import * as constants from '../../common/constants';
import UserProgress from '../../components/UserProgress';

export default class VolunteerProfileBlock extends Component {

  constructor(props) {
    super(props);
    this.sharePage = this.sharePage.bind(this);
  }

  sharePage(){
    FB.ui({
      method: 'share',
      href: `${constants.DOMAIN}${this.props.pathname}`
    });
  }

  render() {
    const SHARE_URL = `${constants.DOMAIN}${this.props.pathname}`;
    const TWITTER_MESSAGE = `Sponsor ${this.props.volunteer.firstName} for each hour volunteered. \
Money goes to ${this.props.project.name}.`;
    const SLOGAN = this.props.team.slogan || 'Twice the difference';
    const SHARE_HEADLINE = `Sponsor ${this.props.volunteer.firstName} and Make Twice the Difference`;
    const SHARE_MESSAGE = `Please help ${this.props.volunteer.firstName} raise \
money for ${this.props.project.name}. Sponsor each hour of volunteering \
and make twice the difference.%0D%0A`;
    const EMAIL_MESSAGE = SHARE_MESSAGE + `%0D%0A
%0D%0A
http://${SHARE_URL}%0D%0A
%0D%0A
From ${this.props.volunteer.firstName}:%0D%0A
${this.props.volunteer.description}` ;

    return (
      <div className="volunteer-profile-block">
        <Helmet
          meta={[
              { "property": "og:image",       "content": `${this.props.team.slug}` },
              { "property": "og:title",       "content": SHARE_HEADLINE },
              { "property": "og:description", "content": SHARE_MESSAGE },
          ]}
        />

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
                      Share my goal
                  </span>
                  <a href={`mailto:?subject=${SHARE_HEADLINE}&body=${EMAIL_MESSAGE}`}
                      className="share"
                  >
                      <i className="fa fa-envelope"/>
                  </a>
                  <a onClick={this.sharePage}
                      className="share"
                  >
                      <i className="fa fa-facebook"/>
                  </a>
                  <a href={`https://twitter.com/share?url=${SHARE_URL}&text=${TWITTER_MESSAGE}&via=${constants.TWITTER_USERNAME}&hashtags=maketwicethedifference`}
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
