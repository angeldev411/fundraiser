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
import Dropzone from 'react-dropzone';


import * as Urls from '../../../urls.js';
// TODO dynamic data
import * as data from '../../../common/test-data';

export default class AdminVolunteerProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: {
                preview: '/assets/images/user.png',
            },
        };
    }

    componentWillMount() {
        document.title = 'My profile | Raiserve';
    }

    onDrop = (files) => {
        this.setState({
            file: files[0],
        });
    };

    render() {
        const pageNav = [
            {
                type: 'link',
                title: 'Record my hours',
                href: '#',
            },
            {
                type: 'link',
                title: 'My Public Page',
                href: `${Urls.getVolunteerProfileUrl(data.project.slug, data.team.slug, data.volunteer.slug)}`,
            },
            {
                type: 'link',
                title: 'My Profile',
                href: `${Urls.ADMIN_VOLUNTEER_PROFILE_URL}`,
            },
        ];

        return (
            <Page>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'My Profile'}
                        description={'THE LAST STEP. A simple but important step to keep your public page up-to-date & fresh.'}
                    />
                    <section className="edit-volunteer-profile form-container">
                        <form className="col-xs-12 col-md-6">
                            <div className="form-group">
                                <input type="text"
                                    name="firstname"
                                    id="firstname"
                                />
                                <label htmlFor="firstname">{'Firstname'}</label>
                            </div>
                            <div className="form-group">
                                <input type="text"
                                    name="lastname"
                                    id="lastname"
                                />
                                <label htmlFor="lastname">{'Lastname'}</label>
                            </div>
                            <div className="form-group">
                                <input type="text"
                                    name="zipcode"
                                    id="zipcode"
                                />
                                <label htmlFor="zipcode">{'Zip Code'}</label>
                            </div>
                            <div className="form-group">
                                <input type="email"
                                    name="email"
                                    id="email"
                                />
                                <label htmlFor="email">{'Email address'}</label>
                            </div>
                            <div className="form-group">
                                <input type="password"
                                    name="new-password"
                                    id="new-password"
                                />
                                <label htmlFor="new-password">{'New Password'}</label>
                            </div>
                            <div className="form-group">
                                <input type="password"
                                    name="new-password-confirmation"
                                    id="new-password-confirmation"
                                />
                                <label htmlFor="new-password-confirmation">{'Mew Password Confirmation'}</label>
                            </div>
                            <div className="dropzone form-group">
                                <Dropzone
                                    onDrop={this.onDrop}
                                    multiple={false}
                                    style={{ }}
                                >
                                    <img
                                        className={"dropzone-image"}
                                        src={this.state.file.preview}
                                    />
                                    <p className={"dropzone-text"}>{'Upload profile photo'}</p>
                                </Dropzone>
                            </div>
                            <div className="form-group">
                                <input type="text"
                                    name="goal"
                                    id="goal"
                                />
                                <label htmlFor="goal">{'Goal Hours'}</label>
                            </div>
                            <div className="form-group">
                                <textarea
                                    name="description"
                                    id="description"
                                    defaultValue="Why Your Volunteering, Why this matters to you. Be inspiring as this will engage people to sponsor you."
                                    rows="3"
                                />
                                <label htmlFor="description">{'Description'}</label>
                            </div>
                            <Button type="btn-green-white">{'Save'}</Button>
                        </form>
                    </section>
                    <AdminShareEfforts/>
                </AdminLayout>
            </Page>
        );
    }
}
