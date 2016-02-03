import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import * as Constants from '../../common/constants.js';

export default class AdminProjectForm extends Component {
    render() {
        return (
            <Form id="project-form"
                title={this.props.title}
                description="Isicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
            >
                <div className="form-group">
                    <input type="text"
                        name="name"
                        id="name"
                        value={this.props.project ? this.props.project.name : null}
                    />
                    <label htmlFor="name">{'Project Name'}</label>
                </div>

                <div className="input-group">
                    <span className="input-group-addon"
                        id="slug-addon"
                    >{`${Constants.DOMAIN}/`}</span>
                    <input type="text"
                        name="slug"
                        id="slug"
                        aria-describedby="slug-addon"
                        value={this.props.project ? this.props.project.slug : null}
                    />
                    <label htmlFor="slug">{'Public Url'}</label>
                </div>

                <div className="form-group">
                    <input type="email"
                        name="project-admin-email"
                        id="project-admin-email"
                        value={this.props.project ? this.props.project.projectAdminEmail : null}
                    />
                    <label htmlFor="project-admin-email">{'Project Admin Email'}</label>
                </div>

                <Button type="btn-success">{'Create Project'}</Button>
            </Form>
        );
    }
}

AdminProjectForm.propTypes = {
    title: React.PropTypes.string,
    project: React.PropTypes.object,
};
