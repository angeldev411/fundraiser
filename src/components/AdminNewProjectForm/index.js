import React, { Component } from 'react';
import Button from '../../components/Button';
import * as Constants from '../../common/constants.js';

export default class AdminNewProjectForm extends Component {
    render() {
        return (
            <div id="new-project"
                className="form-container col-xs-12 col-md-8 col-md-offset-2"
            >
                <h2>{'Add New Project'}</h2>
                <p>{'Isicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'}</p>
                <form>
                    <div className="form-group">
                        <input type="text"
                            name="name"
                            id="name"
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
                        />
                        <label htmlFor="slug">{'Public Url'}</label>
                    </div>

                    <div className="form-group">
                        <input type="email"
                            name="project-admin-email"
                            id="project-admin-email"
                        />
                        <label htmlFor="project-admin-email">{'Project Admin Email'}</label>
                    </div>

                    <Button type="btn-success">{'Create Project'}</Button>
                </form>
            </div>
        );
    }
}
