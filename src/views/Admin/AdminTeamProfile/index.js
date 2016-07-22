/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import DateTimeInput from 'react-bootstrap-datetimepicker';
import 'components/_react-bootstrap-datetime-picker.scss';

/* Then React components */
import Page from '../../../components/Page';
import Button from '../../../components/Button';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';
import AdminTeamEmailForm from '../../../components/AdminTeamEmailForm';
import * as Urls from '../../../urls.js';
import * as Actions from '../../../redux/team/actions';
import * as UserActions from '../../../redux/user/actions';

class AdminTeamProfile extends Component {
  constructor(props, ...args) {
    super(props, ...args)
    this.state = {
      team: props.user.team,
      passwordRequested: false,
      inputDateVal: moment(props.user.team.deadline).format('YYYY-MM-DD'), // used only for deadline input state
    }
    this.handleDateChange = this.handleDateChange.bind(this)
  }
  componentDidMount(props) {
    document.title = 'Team profile | raiserve';
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({
        user: nextProps.user,
        team: nextProps.user.team,
        error: null,
      });
    }
    if (nextProps.reset) {
      this.setState({
        passwordRequested: true,
      });
    }
  }

  changeSupervisorSignatureRequired = (event) => {
    const newState = Object.assign({}, this.state);

    newState.team.signatureRequired = event.nativeEvent.target.checked;

    this.setState(newState);

    Actions.updateTeam(
      newState.team.id,
      newState.team
    )(this.props.dispatch);
  };

  changeHoursApprovalRequired = (event) => {
    const newState = Object.assign({}, this.state);

    newState.team.hoursApprovalRequired = event.nativeEvent.target.checked;

    this.setState(newState);

    Actions.updateTeam(
      newState.team.id,
      newState.team
    )(this.props.dispatch);
  };

  disabledGoal = () => {
    const team = this.state.team;
    if(team.totalRaised > 0 || team.totalSponsors > 0) return 'disabled';
    return '';
    //   if(user.totalSponsors > 0 || user.)
  }

  changeGoal = (event) => {
    const newState = Object.assign({}, this.state);

    newState.team.goal = event.nativeEvent.target.value;

    this.setState(newState);

    Actions.updateTeam(
      newState.team.id,
      newState.team
    )(this.props.dispatch);
  };

  handleDateChange(dateString) {
    const m = moment(dateString, 'YYYY-MM-DD')
    if(m.isValid()) {
      const nextState = Object.assign({}, this.state)
      nextState.team.deadline = m.toISOString()
      nextState.inputDateVal = m.format('YYYY-MM-DD')
      this.setState(nextState, () => {
        Actions.updateTeam(
          nextState.team.id,
          nextState.team
        )(this.props.dispatch);
      })
    }
  }

  requestPassword = () => {
    this.setState({
      loading: true,
    });
    UserActions.requestPasswordReset(
      { email: this.props.user.email },
    )(this.props.dispatch);
  };

    render() {
        if (!this.props.user) {
            return (null);
        }

        const pageNav = [
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

        return (
          <Page>
            <AdminLayout pageNav={pageNav}>
              <AdminContentHeader
                title={'Edit Team Profile'}
                description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
              />
              <div className="edit-team-profile">
                <section className={'form-container'}>
                  <form className={'col-xs-12 col-md-6'}>
                    <Button
                      customClass="btn-lg btn-transparent-green"
                      to={`${Urls.getTeamProfileUrl(this.props.user.project.slug, this.props.user.team.slug)}?edit`}
                    >
                      {'Edit the team page'}
                    </Button>
                    <Button
                      onClick={this.requestPassword}
                      customClass="btn-lg btn-transparent-green"
                      disabled={this.state.passwordRequested}
                      noSpinner
                    >
                      {'Change Password'}
                    </Button>
                    {this.state.passwordRequested ? (
                      <p className={'action-description'}>You should receive a reset password email shortly.</p>
                    ) : (
                      <p className={'action-description'}>Optional</p>
                    )}
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="supervisor-signature"
                        id="supervisor-signature"
                        value=""
                        checked={this.props.user.team.signatureRequired}
                        onChange={(e) => {this.changeSupervisorSignatureRequired(e)}}
                      />
                      <label
                        className="select-label"
                        htmlFor="supervisor-signature"
                      >
                        Require Supervisor signature
                      </label>
                      <p className={'action-description action-margin'}>for the hours your volunteers execute</p>
                    </div>
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="leader-signature"
                        id="leader-signature"
                        value=""
                        checked={this.props.user.team.hoursApprovalRequired}
                        onChange={(e) => {this.changeHoursApprovalRequired(e)}}
                      />
                      <label
                        className="select-label"
                        htmlFor="leader-signature"
                      >
                        Require Team Leader approval
                      </label>
                      <p className={'action-description action-margin'}>for the hours your volunteers execute</p>
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <input
                          disabled={this.disabledGoal()}
                          type="text"
                          name="goal"
                          id="goal"
                          value={this.props.user.team.goal}
                          onChange={(e) => {this.changeGoal(e)}}
                        />
                        <span className="lock input-group-addon">
                          {this.disabledGoal() ? (
                            <i className="fa fa-lock" aria-hidden="true"></i>
                          ) : (
                            <i className="fa fa-unlock" aria-hidden="true"></i>
                          )}
                        </span>
                      </div>
                      {this.disabledGoal() ? (
                        <label className={'action-description action-margin goal-description'}>Note:  Your team already as a sponsor, Goal hours are locked.</label>
                      ) : (
                        <label className={'action-description action-margin goal-description'}>How many total hours is your team aiming for?<br/>Note: you cannot change your goal hours after you get your first sponsor</label>
                      )}
                    </div>
                    <div className="form-group" style={{ position: 'relative' }}>
                      <DateTimeInput
                        inputProps={{
                          value: this.state.inputDateVal,
                        }}
                        onChange={this.handleDateChange}
                        inputFormat={'YYYY-MM-DD'}
                        format={'YYYY-MM-DD'}
                        mode={'date'}
                        minDate={moment()}
                        maxDate={moment().add(1, 'year')}
                        dateTime={moment(this.state.team.deadline, 'YYYY-MM-DD').format('YYYY-MM-DD')}
                      />
                      <label className={'action-description action-margin goal-description'}>What is the deadline for your team? It can be up to a year from the start date.</label>
                    </div>
                     <div className="form-group">
                      <textarea
                        name="defaultVolunteerDescription"
                        id="defaultVolunteerDescription"
                        placeholder="Why your team members are Volunteering, why this matters. This will be the default message for your volunteers."
                        defaultValue={this.state.team.defaultVolunteerDescription}
                        rows="3"
                        onChange={(e) => { this.change('defaultVolunteerDescription', e) }}
                      />
                      <label htmlFor="defaultVolunteerDescription">{'Default Volunteer Description'}</label>
                    </div>
                    <Button
                      customClass="btn-lg btn-green-white"
                      to={`${Urls.getTeamProfileUrl(this.props.user.project.slug, this.props.user.team.slug)}`}
                    >
                      View Team Page
                    </Button>
                  </form>
                </section>
              </div>
            </AdminLayout>
          </Page>
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    team: reduxState.main.team.team,
    reset: reduxState.main.user.reset,
}))(AdminTeamProfile);
