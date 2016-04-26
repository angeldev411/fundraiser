/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    componentWillMount(props) {
        document.title = 'Team profile | Raiserve';

        this.setState({
            team: this.props.user.team,
            passwordRequested: false,
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
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

    changeGoal = (event) => {
        const newState = Object.assign({}, this.state);

        newState.team.goal = event.nativeEvent.target.value;

        console.log(newState);

        this.setState(newState);

        Actions.updateTeam(
            newState.team.id,
            newState.team
        )(this.props.dispatch);
    };

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
                        <section>
                            <Button
                                customClass="btn-lg btn-transparent-green"
                                to={`${Urls.getTeamProfileUrl(this.props.user.project.slug, this.props.user.team.slug)}?edit`}
                            >
                                {'Edit Your Page'}
                            </Button>
                            <p className={'action-description'}>{'You can edit your public team page visuals and messaging by clicking the link above'}</p>
                        </section>
                        <section>
                            <Button
                                onClick={this.requestPassword}
                                customClass="btn-lg btn-transparent-green"
                                disabled={this.state.passwordRequested}
                                noSpinner
                            >
                                    {'Change Password'}
                            </Button>
                            {this.state.passwordRequested ?
                                <p className={'action-description'}>
                                    {'You should receive a reset password email shortly.'}
                                </p> :
                                <p className={'action-description'}>{'Optional'}</p>
                            }
                        </section>
                        <section>
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
                                {'Require Supervisor signature'}
                            </label>
                            <p className={'action-description action-margin'}>{'for the hours your volunteers execute'}</p>
                        </section>
                        <section>
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
                                {'Require Team Leader approval'}
                            </label>
                            <p className={'action-description action-margin'}>{'for the hours your volunteers execute'}</p>
                        </section>
                        <section>
                            <input
                                type="text"
                                name="goal"
                                id="goal"
                                value={this.props.user.team.goal}
                                onChange={(e) => {this.changeGoal(e)}}
                            />
                            <p className={'action-description action-margin'}>{'Goal hours (minimum 1)'}</p>
                        </section>
                        <section>
                            <Button
                                customClass="btn-lg btn-green-white"
                                to={`${Urls.getTeamProfileUrl(this.props.user.project.slug, this.props.user.team.slug)}`}
                            >
                                {'View Team Page'}
                            </Button>
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
