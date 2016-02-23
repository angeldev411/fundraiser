/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import AuthenticatedView from '../AuthenticatedView';
import Button from '../../../components/Button';
import ModalButton from '../../../components/ModalButton';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';
import * as Urls from '../../../urls.js';
// TODO dynamic data
import * as data from '../../../common/test-data';

export default class AdminTeamProfile extends Component {
    componentWillMount() {
        document.title = 'Team profile | Raiserve';
    }

    render() {
        const pageNav = [
            {
                type: 'link',
                title: 'Email Your Team',
                href: '#',
            },
            {
                type: 'button',
                title: 'Invite members',
                content:
                    <AdminInviteTeamMembersForm
                        title={"Invite New Team Members"}
                        project={data.project}
                        team={data.team}
                    />,
            },
            {
                type: 'link',
                title: 'My Public Team Page',
                href: `${Urls.getTeamProfileUrl(data.project.slug, data.team.slug)}`,
            },
            {
                type: 'link',
                title: 'Edit Team Profile',
                href: `${Urls.ADMIN_TEAM_PROFILE_URL}`,
            },
        ];


        return (
            <AuthenticatedView accessLevel={'TEAM_LEADER'}>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'Edit Team Profile'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <div className="edit-team-profile">
                        <section>
                            <Button
                                customClass="btn-lg btn-transparent-green"
                                to={`${Urls.getTeamProfileUrl(data.project.slug, data.team.slug)}?edit`}
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
                                to={Urls.getTeamProfileUrl(data.project.slug, data.team.slug)}
                            >
                                {'View Team Page'}
                            </Button>
                        </section>
                    </div>
                </AdminLayout>
            </AuthenticatedView>
        );
    }
}
