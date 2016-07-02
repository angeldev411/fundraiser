import React, { Component } from 'react'
import * as ProjectActions from '../../../redux/project/actions';
import * as TeamActions from '../../../redux/team/actions';
import * as VolunteerActions from '../../../redux/volunteer/actions';
import { connect } from 'react-redux';

import Page from '../../../components/Page';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';

class RecordedHours extends Component {

  constructor(props){
    super(props);
    this.state = {
      hours: []
    };
  }

  componentWillMount(){
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

  render () {
    document.title = 'Recorded Hours | raiserve';
    // For a project, if any teams have a signature requirement,
    // show supervisor info. For a team or volunteer, check the team.
    const includeSupervisor = this.state.pageType === 'project' ?
                        _(this.state.hours).some(['signatureRequired', true])
                        : this.props.user.team.signatureRequired;
    const includeTeam       = this.state.pageType === 'project';
    const includeVolunteer  = this.props.pageType != 'team';

    return (
      <Page>
        <AdminLayout>
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
    user: reduxState.main.auth.user,
    hours
  };
})(RecordedHours);
