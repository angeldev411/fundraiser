import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import * as Constants from '../../common/constants.js';

export default class AdminTeamForm extends Component {
    render() {
        let domain = Constants.DOMAIN;

        if (this.props.project.slug.length > 10) {
            domain = '...';
        }

        return (
            <Form id="team-form"
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                title={this.props.title}
                description={'Isicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'}
            >
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
            </Form>
        );
    }
}

AdminTeamForm.propTypes = {
    project: React.PropTypes.object,
    title: React.PropTypes.string,
};