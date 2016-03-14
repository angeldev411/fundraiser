/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
/* Then React components */
import Page from '../../../components/Page';
import Button from '../../../components/Button';
import ModalButton from '../../../components/ModalButton';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';
import AdminTeamEmailForm from '../../../components/AdminTeamEmailForm';
import * as Urls from '../../../urls.js';
import * as Actions from '../../../redux/team/actions';
import AdminApproveHours from '../../../components/AdminApproveHours';
import * as TeamActions from '../../../redux/team/actions';


class AdminTeamProfile extends Component {
    componentWillMount(props) {
        document.title = 'Team profile | Raiserve';
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.team) {
            this.setState({
                team: nextProps.team,
            });
        }
        if (nextProps.user) {
            this.setState({
                user: nextProps.user,
                team: nextProps.user.team,
            });
        }
    }

    changeSupervisorSignatureRequired = (event) => {
        const newState = Object.assign({}, this.state);

        newState.user.team.signatureRequired = event.nativeEvent.target.checked;

        this.setState(newState);

        Actions.updateTeam(
            newState.user.team.id,
            newState.user.team
        )(this.props.dispatch);
    };

    changeHoursApprovalRequired = (event) => {
        const newState = Object.assign({}, this.state);

        newState.user.team.hoursApprovalRequired = event.nativeEvent.target.checked;

        this.setState(newState);

        Actions.updateTeam(
            newState.user.team.id,
            newState.user.team
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
                        title={"Invite New Team Members"}
                        project={this.props.user.project}
                        team={this.props.user.team}
                    />,
            },
            {
                title: 'Approve Hours',
                type: 'button',
                content: <AdminApproveHours
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
                            <ModalButton customClass="btn-lg btn-transparent-green">{'Change Password'}</ModalButton>
                        </section>
                        <section>
                            <input
                                type="checkbox"
                                name="supervisor-signature"
                                id="supervisor-signature"
                                value=""
                                checked={this.state.team.signatureRequired}
                                onChange={(e) => {this.changeSupervisorSignatureRequired(e)}}
                            />
                            <label
                                className="select-label"
                                htmlFor="supervisor-signature"
                            >
                                {'Require Supervisor signature'}
                            </label>
                            <p className={'action-description'}>{'for the hours your volunteers execute'}</p>
                        </section>
                        <section>
                            <input
                                type="checkbox"
                                name="leader-signature"
                                id="leader-signature"
                                value=""
                                checked={this.state.team.hoursApprovalRequired}
                                onChange={(e) => {this.changeHoursApprovalRequired(e)}}
                            />
                            <label
                                className="select-label"
                                htmlFor="leader-signature"
                            >
                                {'Require Team Leader approval'}
                            </label>
                            <p className={'action-description'}>{'for the hours your volunteers execute'}</p>
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
}))(AdminTeamProfile);
