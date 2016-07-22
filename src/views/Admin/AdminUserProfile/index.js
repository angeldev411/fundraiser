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
import Modal from '../../../components/Modal';
import ModalButton from '../../../components/ModalButton/';
import SocialShareLinks from '../../../components/SocialShareLinks';
import Dropzone from 'react-dropzone';
import fixOrientation from 'fix-orientation';
import * as Actions from '../../../redux/volunteer/actions';
import * as UserActions from '../../../redux/user/actions';

import * as constants from '../../../common/constants';
import * as Urls from '../../../urls.js';

export default class AdminUserProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user:           this.props.user,
            originalImage:  this.props.user.image,
            loading:        false,
            editPassword:   false,
            success:        false,
            cropperOpen:    false,
            imageLoading:   false,
            showRecordHoursSuccessModal:  false,
            showBecomeVolunteerModal:     false,
            leaderBecomingVolunteer:      false,
        };
    }

    componentWillMount() {
        document.title = 'My profile | raiserve';
    }

    componentWillReceiveProps(nextProps) {
        
        if( nextProps.user && this.state.leaderBecomingVolunteer && nextProps.user.roles.includes('VOLUNTEER') ){
          this.setState({
            leaderBecomingVolunteer: false
          });
          this.toggleBecomeVolunteerModal();
        }

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
    };

    disabledGoal = () => {
      const user = this.state.user;
      if(user.totalSponsors || user.raised) return 'disabled';
      return '';
    //   if(user.totalSponsors > 0 || user.)
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
            services: ['CONVERT', 'COMPUTER', 'FACEBOOK', 'WEBCAM', 'URL'],
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
        const team = this.props.user.team;

        if (!user.password || user.password !== user.password2) {
            delete user.password;
        }

        user.description = user.description || team.defaultVolunteerDescription;

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
        let user = this.state.user;
        let team = this.props.user.team;
        return user && (user.description || team.defaultVolunteerDescription);
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
            return constants.RESIZE_PROFILE_EDIT + this.state.user.image;
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

    toggleShareModal(){
      this.setState({
        showRecordHoursSuccessModal: !this.state.showRecordHoursSuccessModal
      });
    }

    userCanBecomeVolunteer(){
      const roles = this.props.user.roles;
      return roles.includes('TEAM_LEADER') && !roles.includes('VOLUNTEER');
    }

    addLeaderAsVolunteer = () => {
      this.setState({
        leaderBecomingVolunteer: true
      });

      UserActions.makeVolunteer(this.state.user)(this.props.dispatch);
    }

    toggleBecomeVolunteerModal = () => {
      this.setState({
        showBecomeVolunteerModal: !this.state.showBecomeVolunteerModal
      });
    }

    nameNotProvided = () => {
      return this.props.user.firstName.length === 0 || this.props.user.lastName.length === 0;
    }

    render() {
        if (!this.state.user) {
            return null;
        }

        let pageNav = [];

        if ( this.props.user.roles.includes('VOLUNTEER') ){
          pageNav = pageNav.concat([
            {
              type: 'button',
              title: 'Record my hours',
              content: <RecordHoursForm team={this.props.user.team} />,
              onHourLogSuccess: this.toggleShareModal.bind(this)
            },
            {
              type: 'link',
              title: 'My Public Page',
              href: `${Urls.getVolunteerProfileUrl(this.props.user.project.slug, this.props.user.team.slug, this.props.user.slug)}`,
            }
          ]);
        }

        pageNav.push({
          type: 'link',
          title: 'Edit My Profile',
          href: Urls.ADMIN_USER_PROFILE_URL
        });

        if( this.props.user.roles.includes('TEAM_LEADER') && 
            this.props.user.roles.includes('VOLUNTEER') ) {
          pageNav.push({
            type:       'link',
            title:      'My Volunteer Dash',
            href:       Urls.ADMIN_VOLUNTEER_DASHBOARD_URL,
            className:  'navPadding'
          });
        }

        return (
            <Page>
                { this.state.showRecordHoursSuccessModal ?
                  <Modal
                    content={
                      <div id={'success-pledge'}>
                        <p>{`Great work, ${this.props.user.firstName}!`}</p>
                        <p>{`Share your progress using the links below.`}</p>
                        <SocialShareLinks
                          volunteer={this.props.user}
                          project={this.props.user.project}
                          team={this.props.user.team}
                        />
                      </div>
                    }
                    onClick={this.toggleShareModal.bind(this)}
                  />
                  : null
                }

                { this.state.showBecomeVolunteerModal ?
                  <Modal
                    content={ 
                      <div id={'success-pledge'}>
                        <p>{`Fantastic! You're now a volunteer on your team. To finish the process, add your profile pic, personal fundraising message and number of volunteer goal hours to your profile.`}</p>
                        <p>{`We've added a link to the left-hand column which you can use to view your personal fundraising dashboard. From there, you can see your sponsors, a history of your personal volunteer hours, and a link to your fundraising page.`}</p>
                        <p>{`Be sure to share your page with friends and family to start getting sponsors!`}</p>
                        <SocialShareLinks
                          volunteer={this.props.user}
                          project={this.props.user.project}
                          team={this.props.user.team}
                        />
                      </div>
                    }
                    onClick={this.toggleBecomeVolunteerModal}
                  />
                  : null
                }

                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'My Profile'}
                        description={'Keep your public page up-to-date & fresh.'}
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
                                {/*
                                <div className="form-group">
                                    <input type="text"
                                        name="location"
                                        id="location"
                                        defaultValue={this.getUserLocation()}
                                        onChange={(e) => { this.handleChange(e, 'location') }}
                                    />
                                    <label htmlFor="zipcode">{'Zip Code'}</label>
                                </div>
                                */}
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
                                    this.state.editPassword ? (
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
                                    ) : (
                                            <div>
                                                <section>
                                                    <Button
                                                        customClass="btn-lg btn-transparent-green"
                                                        onClick={this.handlePasswordInputs}
                                                    >
                                                        {'Change Password'}
                                                    </Button>
                                                </section>
                                            </div>
                                    )
                                }

                                {
                                    this.userCanBecomeVolunteer() ? (
                                      <div>
                                          <section>
                                              <Button
                                                  customClass="btn-lg btn-transparent-green"
                                                  onClick={this.addLeaderAsVolunteer}
                                                  disabled={this.nameNotProvided()}
                                                  noSpinner={true}
                                              >
                                                  {'Add me as a volunteer on the team'}
                                              </Button>
                                              { this.nameNotProvided() ? 
                                                <p className={'action-description'}>{'Please update and save your first and last name'}</p>
                                                : null
                                              }
                                          </section>
                                      </div>
                                    ) : (
                                        null
                                    )
                                }

                                {
                                  this.props.user.roles.includes('VOLUNTEER') ? (

                                    <div>
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
                                                value={this.getUserMessage()}
                                                rows="3"
                                                onChange={(e) => { this.handleChange(e, 'description') }}
                                            />
                                            <label htmlFor="description">{'Description'}</label>
                                        </div>
                                        <div className="form-group" id={'edit-goal'}>
                                            <div className="input-group">
                                                <input type="text"
                                                    disabled={this.disabledGoal()}
                                                    name="goal"
                                                    id="goal"
                                                    defaultValue={this.getUserGoal()}
                                                    onChange={(e) => { this.handleChange(e, 'goal') }}
                                                />
                                                <span className="lock input-group-addon">
                                                    {
                                                        this.disabledGoal() ?
                                                        <i className="fa fa-lock" aria-hidden="true"></i>:
                                                        <i className="fa fa-unlock" aria-hidden="true"></i>
                                                    }
                                                </span> 
                                            </div>
                                             { this.disabledGoal() ? ( 
                                                <label htmlFor="goal">{`Goal Hours, by ${this.deadline()}`}<span className={'lowercase'}>{'  You already have a sponsor, Goal hours are locked.'}</span></label>
                                             ) : (
                                                <label htmlFor="goal">{`Goal Hours, by ${this.deadline()}`}<span className={'lowercase'}>{'  Be conservative, you can always add another goal in the future. Note: you cannot change your goal hours after you get your first sponsor'}</span></label>
                                             )}
                                        </div>
                                    </div>
                                  ) : (
                                    null
                                  )
                                }

                                {this.state.success ? this.getSuccessMessage() : null}
                                {this.state.error ? this.getErrorMessage() : null}

                                {
                                  this.state.success && this.state.user.roles.includes('VOLUNTEER') ? (
                                      <Button
                                          to={`${Urls.getVolunteerProfileUrl(this.props.user.project.slug, this.props.user.team.slug, this.props.user.slug)}`}
                                          customClass="profile-actions btn-green-white"
                                      >
                                          {'Preview your fundraising page'}
                                      </Button>
                                  ) : (
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
                                  )
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
}))(AdminUserProfile);
