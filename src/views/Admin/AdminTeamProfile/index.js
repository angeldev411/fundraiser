/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../../components/Page';
import Button from '../../../components/Button';
import ModalButton from '../../../components/ModalButton';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';
import AdminShareEfforts from '../../../components/AdminShareEfforts';
import * as Urls from '../../../urls.js';
// TODO dynamic data
import * as data from '../../../common/test-data';

export default class TeamProfile extends Component {
    componentWillMount() {
        document.title = 'Teams | Raiserve';
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
                title: 'My Team Profile',
                href: `${Urls.ADMIN_TEAM_PROFILE_URL}`,
            },
        ];


        return (
            <Page>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'My Team Profile'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <div className="edit-team-profile">
                        <section>
                            <Button
                                type="btn-lg btn-transparent-green"
                                to={"#"}
                            >
                                {'Edit Your Page'}
                            </Button>
                            <p className={'action-description'}>{'You can edit your public team page visuals and messaging by clicking the link above'}</p>
                        </section>
                        <section>
                            <ModalButton type="btn-lg btn-transparent-green">{'Change Password'}</ModalButton>
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
                        <AdminShareEfforts/>
                        <section>
                            <Button
                                type="btn-lg btn-green-white"
                                to={Urls.getTeamProfileUrl(data.project.slug, data.team.slug)}
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
