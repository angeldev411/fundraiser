import React, {Component} from 'react';
import AdminMenu from '../AdminMenu';
import AdminApproveHours from '../AdminApproveHours';
import * as Urls from '../../urls.js';
import {connect} from 'react-redux';

class AdminLayout extends Component {

  constructor(props){
    super(props);
        
    let pageType = 'VOLUNTEER';

    if (this.props.pageType)
      pageType = this.props.pageType;

    else { // if no pageType was passed in props, infer from user roles
      const roles = this.props.user.roles;

      if ( roles.includes('SUPER_ADMIN') )
        pageType = 'SUPER_ADMIN';
      else if ( roles.includes('PROJECT_LEADER') )
        pageType = 'PROJECT_LEADER';
            else if ( roles.includes('TEAM_LEADER') )
              pageType = 'TEAM_LEADER';
    }

    this.state = {
      pageType
    }
  }

  getNav() {

    const RecordedHoursHistory = {
      title: 'Recorded Hours',
      type: 'link',
      href: Urls.RECORDED_HOURS
    };

    if ( this.state.pageType === 'SUPER_ADMIN') {
      return [
        {
          title: 'Projects',
          type: 'link',
          href: Urls.ADMIN_PROJECTS_URL,
        },
        {
          title: 'All Sponsors',
          type: 'link',
          href: Urls.ADMIN_SPONSORS_URL,
        },
        {
          title: 'All Volunteers',
          type: 'link',
          href: Urls.ADMIN_VOLUNTEERS_URL,
        },
        {
          title: 'Admin & Settings',
          type: 'link',
          href: Urls.ADMIN_SETTINGS_URL,
        },
      ];
    } else if ( this.state.pageType === 'PROJECT_LEADER' ) {
      return [
        {
          title: 'Teams',
          type: 'link',
          href: Urls.ADMIN_TEAMS_URL,
        },
        {
          title: 'All Sponsors',
          type: 'link',
          href: Urls.ADMIN_SPONSORS_URL,
        },
        {
          title: 'All Volunteers',
          type: 'link',
          href: Urls.ADMIN_VOLUNTEERS_URL,
        },
        RecordedHoursHistory
      ];
    } else if ( this.state.pageType === 'TEAM_LEADER' ) {
      return [
        {
          title: 'My Team Dashboard',
          type: 'link',
          href: Urls.ADMIN_TEAM_DASHBOARD_URL,
        },
        {
          title: 'My Team',
          type: 'link',
          href: Urls.ADMIN_TEAM_VOLUNTEERS_URL,
        },
        {
          title: 'My Sponsors',
          type: 'link',
          href: Urls.ADMIN_TEAM_SPONSORS_URL,
        },
        {
          title: 'Approve Hours',
          type: 'button',
          content:
                        <AdminApproveHours
                            team={this.props.user.team}
                         />,
        },
        RecordedHoursHistory
      ];
    } else {
      return [
        {
          title: 'My Dashboard',
          type: 'link',
          href: Urls.ADMIN_VOLUNTEER_DASHBOARD_URL,
        },
        {
          title: 'My Sponsors',
          type: 'link',
          href: Urls.ADMIN_VOLUNTEER_SPONSORS_URL,
        },
        RecordedHoursHistory
      ];
    }
  };

  render() {
    return (
      <div className={"admin-layout"}>
        <div className={'container'}>
          <AdminMenu
            adminNav={this.getNav()}
            pageNav={this.props.pageNav}
          />
          <div className="col-xs-12 col-lg-9 admin-content">
            <section>
              {this.props.children}
            </section>
          </div>
          <div className="clearfix"></div>
        </div>
      </div>
    );
  }
}

AdminLayout.propTypes = {
  pageType: React.PropTypes.string,
  pageNav:  React.PropTypes.array
};

export default connect((reduxState) => ({
  user: reduxState.main.auth.user,
}))(AdminLayout);
