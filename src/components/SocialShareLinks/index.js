import React, {Component} from 'react';
import * as constants from '../../common/constants';
import Helmet from "react-helmet";

class SocialShareLinks extends Component {
  constructor(props) {
    super(props);
    this.sharePage = this.sharePage.bind(this);
  }

  sharePage(){
    let shareUrl = `${constants.DOMAIN}/${this.props.project.slug}/${this.props.team.slug}`;
    if (this.props.volunteer)
      shareUrl = shareUrl + `/${this.props.volunteer.slug}`;

    FB.ui({
      method: 'share',
      href: shareUrl
    });
  }

  render() {
    let shareUrl = `${constants.DOMAIN}/${this.props.project.slug}/${this.props.team.slug}`;

    let TWITTER_MESSAGE, SHARE_HEADLINE, SHARE_MESSAGE, EMAIL_MESSAGE;

    if (this.props.volunteer){
      shareUrl = shareUrl + `/${this.props.volunteer.slug}`;

      TWITTER_MESSAGE = `Sponsor ${this.props.volunteer.firstName} for each hour volunteered. \
Money goes to ${this.props.project.name}.`;
      SHARE_HEADLINE = `Sponsor ${this.props.volunteer.firstName} and Make Twice the Difference`;
      SHARE_MESSAGE = `Please help ${this.props.volunteer.firstName} raise \
money for ${this.props.project.name}. Sponsor each hour of volunteering \
and make twice the difference.`;
      EMAIL_MESSAGE = SHARE_MESSAGE + `%0D%0A
%0D%0A
${shareUrl}%0D%0A
%0D%0A
From ${this.props.volunteer.firstName}:%0D%0A
${this.props.volunteer.description}`;

    } else {

      TWITTER_MESSAGE = `Sponsor ${this.props.team.name} for each hour they volunteer. \
Money goes to ${this.props.project.name}.`;
      SHARE_HEADLINE = `Sponsor ${this.props.team.name} and Make Twice the Difference`;
      SHARE_MESSAGE = `Please help ${this.props.team.name} raise \
money for ${this.props.project.name}.  Sponsor each hour they volunteer \
and make twice the difference.`;
      EMAIL_MESSAGE = SHARE_MESSAGE + `
%0D%0A
%0D%0A
%0D%0A
${shareUrl}%0D%0A
%0D%0A
${this.props.team.description}`;
    }

    return (
      <span className="social-share-links">
        <Helmet
          meta={[
            { "property": "og:url",         "content": `${shareUrl}` },
            { "property": "og:title",       "content": SHARE_HEADLINE },
            { "property": "og:image",       "content": this.props.team.coverImage },
            { "property": "og:description", "content": SHARE_MESSAGE },
          ]}
        />

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
        <a href={`https://twitter.com/share?url=${shareUrl}&text=${TWITTER_MESSAGE}&via=${constants.TWITTER_USERNAME}&hashtags=maketwicethedifference`}
          target="_blank"
          className="share"
        >
          <i className="fa fa-twitter"/>
        </a>
      </span>
    );
  }
}

SocialShareLinks.propTypes = {
  volunteer: React.PropTypes.object,
  project: React.PropTypes.object.isRequired,
  team: React.PropTypes.object.isRequired,
};

export default SocialShareLinks;
