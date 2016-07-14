import React, { Component } from 'react'
import * as ProjectActions from '../../../redux/project/actions';
import * as TeamActions from '../../../redux/team/actions';
import * as VolunteerActions from '../../../redux/volunteer/actions';
import { connect } from 'react-redux';

import Page from '../../../components/Page';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import RecordHoursForm from '../../../components/RecordHoursForm';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';
import AdminTeamEmailForm from '../../../components/AdminTeamEmailForm';
import Modal from '../../../components/Modal';
import SocialShareLinks from '../../../components/SocialShareLinks';
import * as Urls from '../../../urls.js';

class RecordedHours extends Component {

  componentWillMount(){
    document.title = 'Recorded Hours | raiserve';

    this.state = {
      hours: []
    };
    this.updateData();
  }

  updateData(){
    const user = this.props.user;
    let pageType, getHourLogs;

    if( _(user.roles).includes('PROJECT_LEADER') ){
      pageType    = 'project';
      getHourLogs = ProjectActions.getHourLogs;

    } else if( _(user.roles).includes('TEAM_LEADER') ){
      pageType    = 'team';
      getHourLogs = TeamActions.getHourLogs;

    } else {
      pageType    = 'volunteer';
      getHourLogs = VolunteerActions.getHourLogs;
    }

    getHourLogs()(this.props.dispatch);
    this.setState({ pageType });
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      hours: nextProps.hours
    });
  }

  toggleShareModal(){
    this.setState({
      showRecordHoursSuccessModal: !this.state.showRecordHoursSuccessModal
    });
  }

  render () {

    // For a project, if any teams have a signature requirement,
    // show supervisor info. For a team or volunteer, check the team.
    const includeSupervisor = this.state.pageType === 'project' ?
                        _(this.state.hours).some(['signatureRequired', true])
                        : this.props.user.team.signatureRequired;
    const includeTeam       = this.state.pageType === 'project';
    const includeVolunteer  = this.props.pageType != 'team';

    let pageNav = [];

    if (this.state.pageType === 'team')
      pageNav = [
        {
          type: 'button',
          title: 'Email Your Team',
          content:
              <AdminTeamEmailForm
                  project={this.props.user.project}
                  team={this.props.user.team}
              />,
        },
        {
          type: 'button',
          title: 'Invite members',
          content:
              <AdminInviteTeamMembersForm
                  title={"Invite New"}
                  titleLine2={"Team Members"}
                  project={this.props.user.project}
                  team={this.props.user.team}
              />,
        },
        {
          type: 'link',
          title: 'My Public Team Page',
          href: `${Urls.getTeamProfileUrl(this.props.user.project.slug, this.props.user.team.slug)}`,
        },
        {
          type: 'link',
          title: 'Edit Team Profile',
          href: `${Urls.ADMIN_TEAM_PROFILE_URL}`,
        },
      ];

    else if (this.state.pageType === 'volunteer')
      pageNav = [
          {
            type: 'button',
            title: 'Record my hours',
            content: <RecordHoursForm team={this.props.user.team} />,
            onModalToggle: this.updateData.bind(this),
            onHourLogSuccess: this.toggleShareModal.bind(this)
          },
          {
              type: 'link',
              title: 'My Public Page',
              href: `${Urls.getVolunteerProfileUrl(this.props.user.project.slug, this.props.user.team.slug, this.props.user.slug)}`,
          },
          {
              type: 'link',
              title: 'Edit My Profile',
              href: `${Urls.ADMIN_USER_PROFILE_URL}`,
          },
      ];

      if( this.props.user.roles.includes('VOLUNTEER') )
          pageNav.push({
            type:       'link',
            title:      'My Volunteer Dash',
            href:       `${Urls.ADMIN_VOLUNTEER_DASHBOARD_URL}`,
            className:  'navPadding'
          });

    return (
      <Page>
        { this.state.showRecordHoursSuccessModal === true ?
          <Modal
            content={
              <div id={'success-pledge'}>
                <p>{`Great work, ${this.props.user.firstName}!`}</p>
                <p>{`Share your progress using the links below.`}</p>
                <SocialShareLinks
                  volunteer={this.props.user}
                  project={this.props.user.project}
                  team={this.props.user.team}
                />
              </div>
            }
            onClick={this.toggleShareModal.bind(this)}
          />
          : null
        }
        <AdminLayout pageType='TEAM_LEADER' pageNav={pageNav}>
          <AdminContentHeader
            title='Recorded Hours'
            description='Get details on when and where volunteer service was performed'
          />

          <div className='form-container'>
            <div className="table-responsive">
              <table className="hours table">
                <thead>
                  <tr>
                    <th>{'Date'}</th>
                    { includeTeam ? <th>Team</th> : null}
                    { includeVolunteer ? <th>Volunteer</th> : null}
                    <th>{'Location'}</th>
                    <th>{'Hours'}</th>
                    { includeSupervisor ? <th>Supervisor</th> : null }
                    { includeSupervisor ? <th>Signature</th> : null }
                  </tr>
                </thead>
                <tbody>
                  { this.state.hours.map((hour, i) => {
                      if (!hour.approved) return null;

                      return (
                        <tr key={i}>
                          <td>{hour.date.split('T')[0]}</td>
                          { includeTeam ?
                            <td>{hour.teamName}</td>
                          : null }
                          { includeVolunteer ?
                            <td>{hour.firstName} {hour.lastName}</td>
                          : null }
                          <td>{hour.place}</td>
                          <td>{hour.hours} {hour.hours > 1 ? 'Hours' : 'Hour'}</td>
                          { includeSupervisor && hour.signature_url ?
                            <td><a href={`mailto:${hour.supervisorEmail}`}>{hour.supervisorName}</a></td>
                          : null }
                          { includeSupervisor && hour.signature_url ?
                            <td><img className="signature" src={hour.signature_url} alt=""/></td>
                          : null }
                        </tr>
                      );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </AdminLayout>
      </Page>
    );
  }
}

export default connect( (reduxState) => {
  const user = reduxState.main.auth.user;
  let hours;

  if( _(user.roles).includes('PROJECT_LEADER') )
    hours = reduxState.main.project.hoursLogsGet;
  if( _(user.roles).includes('TEAM_LEADER') )
    hours = reduxState.main.team.hourLogsGet;
  else
    hours = reduxState.main.volunteer.hourLogsGet;

  return {
    user,
    hours
  };
})(RecordedHours);
