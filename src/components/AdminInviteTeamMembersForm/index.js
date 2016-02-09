import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import * as Constants from '../../common/constants.js';
import * as Urls from '../../urls.js';

export default class AdminInviteTeamMembersForm extends Component {
    render() {
        const SHARE_URL = `${Constants.DOMAIN}${Urls.getTeamProfileUrl(this.props.project.slug, this.props.team.slug)}/join`;
        const SHARE_TEXT = `${this.props.team.name} on Raiserve`;
        const SHARE_MESSAGE = `${this.props.team.description}`;

        return (
            <Form id="invite-team-members-form"
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                title={this.props.title}
                description={'Isicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'}
            >
                <div className="form-group">
                    <input type="text"
                        name="url"
                        id="url"
                        defaultValue={SHARE_URL}
                    />
                    <label htmlFor="name">{'You can simply copy and paste this url to your email or social channels'}</label>
                </div>

                <div className="form-group">
                    <a href={`mailto:?subject=${SHARE_TEXT}&body=${SHARE_MESSAGE} - ${SHARE_URL}`}
                        className="share"
                    >
                        <i className="fa fa-envelope"/>
                    </a>
                    <a href={`https://www.facebook.com/sharer.php?u=${SHARE_URL}`}
                        target="_blank"
                        className="share"
                    >
                        <i className="fa fa-facebook"/>
                    </a>
                    <a href={`https://twitter.com/share?url=${SHARE_URL}&text=${SHARE_TEXT}&via=${Constants.TWITTER_USERNAME}`}
                        target="_blank"
                        className="share"
                    >
                        <i className="fa fa-twitter"/>
                    </a>
                    <label className={'social'}>
                        {'or simply click on the social channel above and your invite URL will be posted on your behalf.'}
                    </label>
                </div>
            </Form>
        );
    }
}

AdminInviteTeamMembersForm.propTypes = {
    title: React.PropTypes.string,
    project: React.PropTypes.object,
    team: React.PropTypes.object,
};
