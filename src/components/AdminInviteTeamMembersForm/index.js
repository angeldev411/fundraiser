import React, { Component } from 'react';
import Form from '../../components/Form';
import * as Constants from '../../common/constants.js';
import * as Urls from '../../urls.js';

export default class AdminInviteTeamMembersForm extends Component {
    render() {
        const SHARE_URL = `${Constants.DOMAIN}${Urls.getTeamProfileUrl(this.props.project.slug, this.props.team.slug)}/join`;
        const SHARE_SPONSORS_URL = `${Constants.DOMAIN}${Urls.getTeamProfileUrl(this.props.project.slug, this.props.team.slug)}`;
        const SHARE_TEXT = `${this.props.team.name} on Raiserve`;
        const SHARE_MESSAGE = `${this.props.team.description}`;

        return (
            <Form id="invite-team-members-form"
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                title={this.props.title}
                titleLine2={this.props.titleLine2}
                description={'There are many ways to invite people to your team. Whether it’s via email or your social channels, we have made it seamless and easy to spread the good word.'}
            >
                <div className="form-group">
                    <input type="text"
                        name="url"
                        id="url"
                        defaultValue={this.props.sponsors ? SHARE_SPONSORS_URL : SHARE_URL}
                        disabled
                    />
                    <label htmlFor="name">{'You can simply copy and paste this url to your email or social channels'}</label>
                </div>

                <p className={'or-divider'}>{'or'}</p>

                <div className="form-group">
                    <a href={`https://www.facebook.com/sharer.php?u=${SHARE_URL}`}
                        target="_blank"
                        className="share"
                    >
                        <img src="/assets/images/facebook.png"/>
                    </a>
                    <a href={`https://twitter.com/share?url=${SHARE_URL}&text=${SHARE_TEXT}&via=${Constants.TWITTER_USERNAME}`}
                        target="_blank"
                        className="share"
                    >
                        <img src="/assets/images/twitter.png"/>
                    </a>
                    <label className={'social'}>
                        {'simply click on the social channel above and your invite URL will be posted on your behalf.'}
                    </label>
                </div>
            </Form>
        );
    }
}

AdminInviteTeamMembersForm.propTypes = {
    title: React.PropTypes.string,
    titleLine2: React.PropTypes.string,
    project: React.PropTypes.object,
    team: React.PropTypes.object,
    sponsors: React.PropTypes.bool,
};
