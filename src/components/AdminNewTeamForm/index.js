import React, { Component } from 'react';
import Button from '../../components/Button';
import * as Constants from '../../common/constants.js';

export default class AdminNewTeamForm extends Component {
    render() {
        let domain = Constants.DOMAIN;

        if (this.props.project.slug.length > 10) {
            domain = '...';
        }

        return (
            <div id="new-team"
                className="form-container col-xs-12 col-md-8 col-md-offset-2"
            >
                <h2>{'Add New Team'}</h2>
                <p>{'Isicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'}</p>
                <form>
                    <div className="form-group">
                        <input type="text"
                            name="name"
                            id="name"
                        />
                        <label htmlFor="name">{'Team Name'}</label>
                    </div>

                    <div className="input-group">
                        <span className="input-group-addon"
                            id="slug-addon"
                        >{`${domain}/${this.props.project.slug}/`}</span>
                        <input type="text"
                            name="slug"
                            id="slug"
                            aria-describedby="slug-addon"
                        />
                        <label htmlFor="slug">{'Public Url'}</label>
                    </div>

                    <div className="form-group">
                        <input type="email"
                            name="team-leader-email"
                            id="team-leader-email"
                        />
                        <label htmlFor="team-leader-email">{'Team leader Email'}</label>
                    </div>

                    <Button type="btn-success">{'Create Team'}</Button>
                </form>
            </div>
        );
    }
}

AdminNewTeamForm.propTypes = {
    project: React.PropTypes.object,
};
