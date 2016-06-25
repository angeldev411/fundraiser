import React, {Component} from 'react';
import * as constants from '../../common/constants';
import Helmet from "react-helmet";

class VolunteerSocialLinks extends Component {
  constructor(props) {
    super(props);
    this.sharePage = this.sharePage.bind(this);
    this.state = {
      shareUrl: `${constants.DOMAIN}/${this.props.project.slug}/${this.props.team.slug}/${this.props.volunteer.slug}`
    }
  }

  sharePage(){
    FB.ui({
      method: 'share',
      href: this.state.shareUrl
    });
  }

  render() {
    const TWITTER_MESSAGE = `Sponsor ${this.props.volunteer.firstName} for each hour volunteered. \
Money goes to ${this.props.project.name}.`;
    const SLOGAN = this.props.team.slogan || 'Twice the difference';
    const SHARE_HEADLINE = `Sponsor ${this.props.volunteer.firstName} and Make Twice the Difference`;
    const SHARE_MESSAGE = `Please help ${this.props.volunteer.firstName} raise \
money for ${this.props.project.name}. Sponsor each hour of volunteering \
and make twice the difference.`;
    const EMAIL_MESSAGE = SHARE_MESSAGE + `%0D%0A
%0D%0A
${this.state.shareUrl}%0D%0A
%0D%0A
From ${this.props.volunteer.firstName}:%0D%0A
${this.props.volunteer.description}`;

    return (
      <span>
        <Helmet
          meta={[
            { "property": "og:url",         "content": `${this.state.shareUrl}` },
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
        <a href={`https://twitter.com/share?url=${this.state.shareUrl}&text=${TWITTER_MESSAGE}&via=${constants.TWITTER_USERNAME}&hashtags=maketwicethedifference`}
          target="_blank"
          className="share"
        >
          <i className="fa fa-twitter"/>
        </a>
      </span>
    );
  }
}

VolunteerSocialLinks.propTypes = {
  volunteer: React.PropTypes.object.isRequired,
  project: React.PropTypes.object.isRequired,
  team: React.PropTypes.object.isRequired,
};

export default VolunteerSocialLinks;
