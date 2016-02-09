/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../../components/Page';
import Button from '../../../components/Button';
import ModalButton from '../../../components/ModalButton';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import AdminInviteTeamMembersForm from '../../../components/AdminInviteTeamMembersForm';

// TODO dynamic data
import * as data from '../../../common/test-data';

export default class TeamProfile extends Component {
    componentWillMount() {
        document.title = 'Teams | Raiserve';
    }

    render() {
        const pageNav = [
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
                title: 'Email Your Team',
                href: '#',
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
                        <section className="edit-team-page">
                            <Button
                                type="btn-lg btn-transparent-green"
                                to={"#"}
                            >
                                {'Edit Your Page'}
                            </Button>
                            <p className={'action-description'}>{'You can edit your public team page visuals and messaging by clicking the link above'}</p>
                        </section>
                        <section className="edit-password">
                            <ModalButton type="btn-lg btn-transparent-green">{'Change Password'}</ModalButton>
                        </section>
                    </div>
                </AdminLayout>
            </Page>
        );
    }
}
