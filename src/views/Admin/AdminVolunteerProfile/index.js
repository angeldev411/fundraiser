/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import AuthenticatedView from '../AuthenticatedView';
import Button from '../../../components/Button';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import RecordHoursForm from '../../../components/RecordHoursForm';
import Dropzone from 'react-dropzone';

import * as constants from '../../../common/constants';
import * as Urls from '../../../urls.js';
// TODO dynamic data
import * as data from '../../../common/test-data';

export default class AdminVolunteerProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: {
                preview: data.volunteer.image ? `${constants.USER_IMAGES_FOLDER}/${data.volunteer.uniqid}/${data.volunteer.image}` : '/assets/images/user.png',
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
                type: 'button',
                title: 'Record my hours',
                content: <RecordHoursForm/>,
            },
            {
                type: 'link',
                title: 'My Public Page',
                href: `${Urls.getVolunteerProfileUrl(data.project.slug, data.team.slug, data.volunteer.slug)}`,
            },
            {
                type: 'link',
                title: 'Edit Profile',
                href: `${Urls.ADMIN_VOLUNTEER_PROFILE_URL}`,
            },
        ];

        return (
            <AuthenticatedView accessLevel={'VOLUNTEER'}>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'My Profile'}
                        description={'THE LAST STEP. A simple but important step to keep your public page up-to-date & fresh.'}
                    />
                    <div className="edit-volunteer-profile">
                        <section className="form-container">
                            <form className="col-xs-12 col-md-6">
                                <div className="form-group">
                                    <input type="text"
                                        name="firstname"
                                        id="firstname"
                                        defaultValue={data.volunteer.firstname ? data.volunteer.firstname : null}
                                    />
                                    <label htmlFor="firstname">{'Firstname'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="text"
                                        name="lastname"
                                        id="lastname"
                                        defaultValue={data.volunteer.lastname ? data.volunteer.lastname : null}
                                    />
                                    <label htmlFor="lastname">{'Lastname'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="text"
                                        name="location"
                                        id="location"
                                        defaultValue={data.volunteer.location ? data.volunteer.location : null}
                                    />
                                    <label htmlFor="zipcode">{'Zip Code'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="email"
                                        name="email"
                                        id="email"
                                        defaultValue={data.volunteer.email ? data.volunteer.email : null}
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
                                    <label htmlFor="new-password-confirmation">{'New Password Confirmation'}</label>
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
                                    <textarea
                                        name="description"
                                        id="description"
                                        defaultValue={
                                            data.volunteer.message
                                            ? data.volunteer.message
                                            : 'Why Your Volunteering, Why this matters to you. Be inspiring as this will engage people to sponsor you.'
                                        }
                                        rows="3"
                                    />
                                    <label htmlFor="description">{'Description'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="text"
                                        name="goal"
                                        id="goal"
                                        defaultValue={data.volunteer.goal ? data.volunteer.goal : null}
                                    />
                                    <label htmlFor="goal">{'Goal Hours'}<span className={'lowercase'}>{' Be conservative, you can always add another goal in the future.'}</span></label>
                                </div>
                                <Button customClass="btn-green-white">{'Save'}</Button>
                            </form>
                        </section>
                    </div>
                </AdminLayout>
            </AuthenticatedView>
        );
    }
}
