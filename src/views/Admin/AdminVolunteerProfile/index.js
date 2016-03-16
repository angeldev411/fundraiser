/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Then React components */
import Page from '../../../components/Page';
import Button from '../../../components/Button';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import RecordHoursForm from '../../../components/RecordHoursForm';
import Dropzone from 'react-dropzone';
import * as Actions from '../../../redux/volunteer/actions';

import * as constants from '../../../common/constants';
import * as Urls from '../../../urls.js';

export default class AdminVolunteerProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            loading: false,
        };
    }

    componentWillMount() {
        document.title = 'My profile | Raiserve';
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            this.setState({
                user: nextProps.user,
            });
        }

        if (nextProps.volunteerUpdateStatus) {
            this.setState({
                volunteerUpdateStatus: nextProps.volunteerUpdateStatus,
            });
        }
        this.setState({
            loading: false,
        });
    }

    onDrop = (files) => {
        const user = this.state.user;
        const reader = new FileReader();
        const file = files[0];

        reader.onload = (upload) => {
            user.headshotData = upload.target.result;
            this.setState({
                user,
            });
        };
        reader.readAsDataURL(file);
    };

    submitProfile = () => {
        this.setState({
            loading: true,
        });
        const user = this.state.user;

        if (!user.password || user.password !== user.password2) {
            delete user.password;
        }

        delete user.password2;

        Actions.updateProfile(user)(this.props.dispatch);
    };

    getUserFirstName = () => {
        if (this.state.user && this.state.user.firstName) {
            return this.state.user.firstName;
        }
    };

    getUserLastName = () => {
        if (this.state.user && this.state.user.lastName) {
            return this.state.user.lastName;
        }
    };

    getUserEmail = () => {
        if (this.state.user && this.state.user.email) {
            return this.state.user.email;
        }
    };

    getUserLocation = () => {
        if (this.state.user && this.state.user.location) {
            return this.state.user.location;
        }
    };

    getUserMessage = () => {
        if (this.state.user && this.state.user.description) {
            return this.state.user.description;
        }
    };

    getUserGoal = () => {
        if (this.state.user && this.state.user.goal) {
            return this.state.user.goal;
        }
    };

    getUserId = () => {
        if (this.state.user && this.state.user.id) {
            return this.state.user.id;
        }
    };

    getUserImage = () => {
        if (this.state.user && this.state.user.headshotData) {
            return this.state.user.headshotData;
        }
    };


    getUserPreview = () => {
        console.log('Get User Image', this.getUserImage());
        if (this.state.user) {
            if (this.getUserImage()) {
                return this.getUserImage();
            } else {
                return `${constants.USER_IMAGES_FOLDER}/${constants.DEFAULT_AVATAR}`;
            }
        }
    };

    getSuccessMessage = () => {
        return (<div className="success-message">Profile updated!</div>);
    };

    getErrorMessage = () => {
        return (<div className="error-message">Error in the form!</div>);
    };

    handleChange = (evt, name) => {
        const user = this.state.user;

        user[name] = evt.target.value;
        this.setState({
            user,
        });
    };

    render() {
        if (!this.state.user) {
            return null;
        }
        const pageNav = [
            {
                type: 'button',
                title: 'Record my hours',
                content: <RecordHoursForm team={this.props.user.team}/>,
            },
            {
                type: 'link',
                title: 'My Public Page',
                href: `${Urls.getVolunteerProfileUrl(this.props.user.project.slug, this.props.user.team.slug, this.props.user.slug)}`,
            },
            {
                type: 'link',
                title: 'Edit Profile',
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
                    <div className="edit-volunteer-profile">
                        <section className="form-container">
                            <form className="col-xs-12 col-md-6">
                                <div className="form-group">
                                    <input type="text"
                                        name="firstName"
                                        id="firstName"
                                        defaultValue={this.getUserFirstName() ? this.getUserFirstName() : null}
                                        onChange={(e) => { this.handleChange(e, 'firstName') }}
                                    />
                                    <label htmlFor="firstName">{'Firstname'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="text"
                                        name="lastName"
                                        id="lastName"
                                        defaultValue={this.getUserLastName() ? this.getUserLastName() : null}
                                        onChange={(e) => { this.handleChange(e, 'lastName') }}
                                    />
                                    <label htmlFor="lastName">{'Lastname'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="text"
                                        name="location"
                                        id="location"
                                        defaultValue={this.getUserLocation()}
                                        onChange={(e) => { this.handleChange(e, 'location') }}
                                    />
                                    <label htmlFor="zipcode">{'Zip Code'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="email"
                                        name="email"
                                        id="email"
                                        defaultValue={this.getUserEmail() ? this.getUserEmail() : null}
                                        onChange={(e) => { this.handleChange(e, 'email') }}
                                    />
                                    <label htmlFor="email">{'Email address'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="password"
                                        name="new-password"
                                        id="new-password"
                                        onChange={(e) => { this.handleChange(e, 'password') }}
                                    />
                                    <label htmlFor="new-password">{'New Password'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="password"
                                        name="new-password-confirmation"
                                        id="new-password-confirmation"
                                        onChange={(e) => { this.handleChange(e, 'password2') }}
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
                                            src={this.getUserPreview()}
                                        />
                                        <p className={"dropzone-text"}>{'Upload profile photo'}</p>
                                    </Dropzone>
                                </div>
                                <div className="form-group">
                                    <textarea
                                        name="description"
                                        id="description"
                                        placeholder="Why You're Volunteering, Why this matters to you. Be inspiring as this will engage people to sponsor you."
                                        defaultValue={this.getUserMessage()}
                                        rows="3"
                                        onChange={(e) => { this.handleChange(e, 'description') }}
                                    />
                                    <label htmlFor="description">{'Description'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="text"
                                        name="goal"
                                        id="goal"
                                        defaultValue={this.getUserGoal()}
                                        onChange={(e) => { this.handleChange(e, 'goal') }}
                                    />
                                    <label htmlFor="goal">{'Goal Hours'}<span className={'lowercase'}>{' Be conservative, you can always add another goal in the future.'}</span></label>
                                </div>

                                {this.state.volunteerUpdateStatus === false && this.getErrorMessage()}
                                {this.state.volunteerUpdateStatus === true && this.getSuccessMessage()}

                                <Button
                                    customClass="profile-actions btn-green-white"
                                    onClick={this.submitProfile}
                                    disabled={this.state.loading}
                                >
                                    {'Save'}
                                </Button>

                                <Button
                                    to={Urls.ADMIN_VOLUNTEER_DASHBOARD_URL}
                                    customClass="profile-actions btn-transparent-green"
                                >
                                    {'Cancel'}
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
    volunteerUpdateStatus: reduxState.main.volunteer.volunteerUpdateStatus,
}))(AdminVolunteerProfile);
