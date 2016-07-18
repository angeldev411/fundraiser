import React, { Component } from 'react';
import { Link } from 'react-router';
import * as Urls from '../../urls.js';
import UserProgress from '../../components/UserProgress';
import SocialShareLinks from '../../components/SocialShareLinks';

export default class VolunteerProfileBlock extends Component {

  render() {
    const SLOGAN = this.props.team.slogan || 'Twice the difference';

    return (
      <div className="volunteer-profile-block">

        <div className="container">
          <div className={'col-xs-12 col-md-4 volunteer-picture'}>
            <UserProgress
              user={this.props.volunteer}
              totalSponsors={this.props.totalSponsors}
              goalDeadline={new Date(this.props.team.deadline)}
            />
          </div>
          <div className={'col-xs-12 col-md-8 volunteer-description'}>
              <div className={'team-slogan'}>{`YOU + US = ${SLOGAN}`}</div>
              <p>
                  {this.props.volunteer.description}
              </p>
              <div className="share-row">
                 <span className="uppercase share-goal">
                      Please share my page
                  </span>
                  <SocialShareLinks
                    volunteer={this.props.volunteer}
                    project={this.props.project}
                    team={this.props.team}
                  />
                  <Link
                      to={Urls.RAISERVE_BASICS}
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
                  

              </div>
            </div>
          </div>
        </div>
      );
    }
}

VolunteerProfileBlock.propTypes = {
    volunteer: React.PropTypes.object,
    totalSponsors: React.PropTypes.number,
    project: React.PropTypes.object,
    team: React.PropTypes.object,
};
