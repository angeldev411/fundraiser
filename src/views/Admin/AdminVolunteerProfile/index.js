/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

/* Then React components */
import Page from '../../../components/Page';
import Button from '../../../components/Button';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import RecordHoursForm from '../../../components/RecordHoursForm';
import Dropzone from 'react-dropzone';
import AvatarCropper from 'react-avatar-cropper';
import fixOrientation from 'fix-orientation';
import * as Actions from '../../../redux/volunteer/actions';

import * as constants from '../../../common/constants';
import * as Urls from '../../../urls.js';

export default class AdminVolunteerProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            originalImage: this.props.user.image,
            loading: false,
            editPassword: false,
            success: false,
            cropperOpen: false,
            imageLoading: false,
        };
    }

    componentWillMount() {
        document.title = 'My profile | Raiserve';
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user && !this.state.success) {
            this.setState({
                user: nextProps.user,
                loading: false,
            });
        }

        if (nextProps.volunteer) {
            nextProps.volunteer.image = `${nextProps.volunteer.image}?${Math.random()}`;
            this.setState({
                success: true,
                user: nextProps.volunteer,
                loading: false,
                error: null,
            });
        }

        if (nextProps.error) {
            this.setState({
                error: nextProps.error,
                loading: false,
                success: false,
            });
        }
    }
    
    handlePickedFile = (Blob) => {
        const user = this.state.user;
        user.image = Blob.url;
        Actions.updateProfile(user)(this.props.dispatch);
    };
    
    cropFile = () => {
        const user = this.state.user;
        filepicker.processImage(team.coverImage, {
            cropRatio: 4/4,
            mimetype: 'image/*',
            services: ['CONVERT', 'COMPUTER'],
            conversions: ['crop', 'rotate']
        }, this.handlePickedFile.bind(this));
    };
    
    
    
    pickFile = () => {
      filepicker.pick(
        {
            cropRatio: 4/4,
            mimetype: 'image/*',
            services: ['CONVERT', 'COMPUTER', 'FACEBOOK', 'WEBCAM'],
            conversions: ['crop', 'rotate']
        },
        this.handlePickedFile.bind(this)
        );  
    };


    handleRequestHide = () => {
        this.setState({
            cropperOpen: false,
            user: {
                image: this.state.originalImage,
            },
            imageLoading: false,
        });
    };

    submitProfile = () => {
        this.setState({
            loading: true,
            success: false,
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
      return (this.state.user && this.state.user.goal) || 0;
    };

    getUserId = () => {
        if (this.state.user && this.state.user.id) {
            return this.state.user.id;
        }
    };

    getUserImage = () => {
        if (this.state.user && this.state.user.image) {
            return this.state.user.image;
        }
    };


    getUserPreview = () => {
        if (this.state.user) {
            if (this.getUserImage()) {
                return this.getUserImage();
            } else {
                return `${constants.USER_IMAGES_FOLDER}/${constants.DEFAULT_AVATAR}`;
            }
        }
    };

    getSuccessMessage = () => {
        return (<div className="success-message">{'Profile updated!'}</div>);
    };

    getErrorMessage = () => {
        return (<div className="error-message">{this.state.error}</div>);
    };

    deadline = () => {
      return moment(this.props.user.team.deadline).format('MMM D YYYY');
    };

    handleChange = (evt, name) => {
        const user = this.state.user;

        user[name] = evt.target.value;
        this.setState({
            user,
            success: false,
        });
    };

    handlePasswordInputs = () => {
        this.setState({
            editPassword: !this.state.editPassword,
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
                                {
                                    this.state.editPassword ?
                                        <div>
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
                                        </div>
                                    :
                                        <div>
                                            <section>
                                                <Button
                                                    customClass="btn-lg btn-transparent-green"
                                                    onClick={this.handlePasswordInputs}
                                                >
                                                    {'Change Password'}
                                                </Button>
                                            </section>
                                            <p className={'action-description'}>{'Optional'}</p>
                                        </div>
                                }

                                <div className="dropzone form-group">
                       
                                    <img
                                            className={"dropzone-image"}
                                            src={this.getUserPreview()}
                                        />
                                     &nbsp;
                                    <Button
                                    customClass="btn-lg btn-transparent-green"
                                    onClick={this.pickFile}
                                >
                                    Change Photo
                                </Button>
                                </div>
                                <div className="form-group">
                                    <textarea
                                        name="description"
                                        id="description"
                                        placeholder="Why you're Volunteering, why this matters to you. Be inspiring as this will engage people to sponsor you."
                                        defaultValue={this.getUserMessage()}
                                        rows="3"
                                        onChange={(e) => { this.handleChange(e, 'description') }}
                                    />
                                    <label htmlFor="description">{'Description'}</label>
                                </div>
                                <div
                                    className="form-group"
                                    id={'edit-goal'}
                                >
                                    <input type="text"
                                        name="goal"
                                        id="goal"
                                        defaultValue={this.getUserGoal()}
                                        onChange={(e) => { this.handleChange(e, 'goal') }}
                                    />
                                  <label htmlFor="goal">{`Goal Hours, up to ${this.props.user.team.goal} by ${this.deadline()}`}<span className={'lowercase'}>{'  Be conservative, you can always add another goal in the future.'}</span></label>
                                </div>

                                {this.state.success ? this.getSuccessMessage() : null}
                                {this.state.error ? this.getErrorMessage() : null}

                                {
                                  this.state.success ?
                                      <Button
                                          to={`${Urls.getVolunteerProfileUrl(this.props.user.project.slug, this.props.user.team.slug, this.props.user.slug)}`}
                                          customClass="profile-actions btn-green-white"
                                      >
                                          {'Preview'}
                                      </Button> :
                                      <div>
                                          <Button
                                              customClass="profile-actions btn-green-white"
                                              onClick={this.submitProfile}
                                              disabled={this.state.loading}
                                          >
                                              {'Save'}
                                          </Button>
                                          <Button
                                              to={Urls.ADMIN_VOLUNTEER_DASHBOARD_URL}
                                              customClass="profile-actions btn-green-white"
                                          >
                                              {'Cancel'}
                                          </Button>
                                      </div>
                                }
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
    volunteer: reduxState.main.volunteer.user,
    error: reduxState.main.volunteer.error,
}))(AdminVolunteerProfile);
