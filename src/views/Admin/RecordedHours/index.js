import React, { Component } from 'react'
import * as TeamActions from '../../../redux/team/actions';
import * as VolunteerActions from '../../../redux/volunteer/actions';
import { connect } from 'react-redux';

import Page from '../../../components/Page';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';

class RecordedHours extends Component {

  constructor(props){
    super(props);
    console.log('props', props);
    this.state = {
      hours: []
    };
  }

  componentWillMount(){
    const user = this.props.user;

    if( _(user.roles).includes('TEAM_LEADER') ){
      console.log('getting team hours...');
      TeamActions.getHourLogs()(this.props.dispatch);
    } else {
      VolunteerActions.getHourLogs()(this.props.dispatch);
    }
  }

  componentWillReceiveProps(nextProps){
    console.log('got props', nextProps);
    this.setState({
      hours: nextProps.hours
    });
    console.log('Hours:',nextProps.hours);
  }

  render () {
    document.title = 'Recorded Hours | raiserve';

    const includeSupervisor = this.props.user.team.signatureRequired;

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
                    <th>{'Location'}</th>
                    <th>{'Hours'}</th>
                    { includeSupervisor ? <th>Supervisor</th> : null }
                    { includeSupervisor ? <th>Signature</th> : null }
                  </tr>
                </thead>
                <tbody>
                  { this.state.hours.map((hour, i) => {
                      console.log(hour);
                      if (!hour.approved) return null;

                      return (
                        <tr key={i}>
                          <td>{hour.date.split('T')[0]}</td>
                          <td>{hour.place}</td>
                          <td>{hour.hours} {hour.hours > 1 ? 'Hours' : 'Hour'}</td>
                          { includeSupervisor ?
                            <td><a href={`mailto:${hour.supervisorEmail}`}>{hour.supervisorName}</a></td>
                          : null }
                          { includeSupervisor ?
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

  if( _(user.roles).includes('TEAM_LEADER') )
    hours = reduxState.main.team.teamHourLogsGet;
  else
    hours = reduxState.main.volunteer.hourLogsGet;

  return {
    user: reduxState.main.auth.user,
    hours
  };
})(RecordedHours);
