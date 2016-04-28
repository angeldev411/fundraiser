import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Form from '../../components/Form';
import * as Constants from '../../common/constants.js';
import * as Actions from '../../redux/project/actions';

class AdminProjectForm extends Component {
    constructor(props) {
        super(props);
        if (this.props.defaultData) {
            this.state = this.props.defaultData;
        } else {
            this.state = {
                loading: false,
            };
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({
                error: nextProps.error,
                loading: false,
            });
        }
    }

    submit = () => {
        this.setState({
            loading: true,
        });

        const project = Object.assign({}, this.props.defaultData);

        project.name = this.state.name;
        project.slug = this.state.slug;
        project.shortDescription = this.state.shortDescription;
        project.projectLeaderEmail = this.state.projectLeaderEmail;

        if (this.state.id) {
            Actions.updateProject(
                this.state.id,
                this.state.name,
                this.state.slug,
                this.state.shortDescription,
                this.state.projectLeaderEmail,
            )(this.props.dispatch);

            if (this.props.updateProject) {
                this.props.updateProject(project);
            }
        } else {
            Actions.newProject(
                this.state.name,
                this.state.slug,
                this.state.shortDescription,
                this.state.projectLeaderEmail,
            )(this.props.dispatch);

            if (this.props.newProject) {
                this.props.newProject(project);
            }
        }
    };

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    render() {
        return (
            <Form id="project-form"
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                title={this.props.title}
                onSubmit={this.submit}
            >
                <div className="form-group">
                    <input type="text"
                        name="name"
                        id="name"
                        defaultValue={this.props.defaultData ? this.props.defaultData.name : null}
                        onChange={(e) => { this.handleChange(e, 'name') }}
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
                        defaultValue={this.props.defaultData ? this.props.defaultData.slug : null}
                        onChange={(e) => { this.handleChange(e, 'slug') }}
                    />
                    <label htmlFor="slug">{'Public Url'}</label>
                </div>

                <div className="form-group">
                    <input type="email"
                        name="projectLeaderEmail"
                        id="projectLeaderEmail"
                        defaultValue={this.props.defaultData ? this.props.defaultData.projectAdminEmail : null}
                        onChange={(e) => { this.handleChange(e, 'projectLeaderEmail') }}
                    />
                    <label htmlFor="project-admin-email">{'Project Admin Email (Optional)'}</label>
                </div>

                {this.state.error ? <p>{this.state.error}</p> : null}

                <Button
                    customClass="btn-green-white"
                    type={'submit'}
                    disabled={this.state.loading}
                >
                    {this.props.defaultData ? 'Edit Project' : 'Create Project'}
                </Button>
            </Form>
        );
    }
}

AdminProjectForm.propTypes = {
    title: React.PropTypes.string,
    defaultData: React.PropTypes.object,
    newProject: React.PropTypes.func,
};

export default connect((reduxState) => ({
    error: reduxState.main.project.error,
    project: reduxState.main.project.project,
}))(AdminProjectForm);
