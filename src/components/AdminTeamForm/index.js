import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Form from '../../components/Form';
import * as Constants from '../../common/constants.js';
import * as Actions from '../../redux/team/actions';

class AdminTeamForm extends Component {
    constructor(props) {
        super(props);
        if (this.props.defaultData.team) {
            this.state = this.props.defaultData.team;
        } else {
            this.state = {};
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        }
    }

    submit = () => {
        const team = Object.assign({}, this.props.defaultData.team);

        team.name = this.state.name;
        team.projectSlug = this.state.projectSlug;
        team.slug = this.state.slug;
        team.teamLeaderEmail = this.state.teamLeaderEmail;

        if (this.state.id) {
            Actions.updateTeam(
                this.state.id,
                {
                    id: this.state.id,
                    name: this.state.name,
                    projectSlug: this.props.defaultData.project.slug,
                    slug: this.state.slug,
                    teamLeaderEmail: this.state.teamLeaderEmail,
                }
            )(this.props.dispatch);
        } else {
            Actions.newTeam(
                this.state.name,
                this.props.defaultData.project.slug,
                this.state.slug,
                this.state.teamLeaderEmail,
            )(this.props.dispatch);
        }
    };

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    render() {
        let domain = Constants.DOMAIN;

        if (this.props.defaultData.project.slug.length > 10) {
            domain = '...';
        }

        return (
            <Form id="team-form"
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                title={this.props.title}
                description={''}
                onSubmit={this.submit}
            >
                <div className="form-group">
                    <input type="text"
                        name="name"
                        id="name"
                        defaultValue={this.props.defaultData.team ? this.props.defaultData.team.name : null}
                        onChange={(e) => { this.handleChange(e, 'name') }}
                    />
                    <label htmlFor="name">{'Team Name'}</label>
                </div>

                <div className="input-group">
                    <span className="input-group-addon"
                        id="slug-addon"
                    >{`${domain}/${this.props.defaultData.project.slug}/`}</span>
                    <input type="text"
                        name="slug"
                        id="slug"
                        aria-describedby="slug-addon"
                        defaultValue={this.props.defaultData.team ? this.props.defaultData.team.slug : null}
                        onChange={(e) => { this.handleChange(e, 'slug') }}
                    />
                    <label htmlFor="slug">{'Public Url'}</label>
                </div>

                <div className="form-group">
                    <input type="email"
                        name="teamLeaderEmail"
                        id="teamLeaderEmail"
                        defaultValue={this.props.defaultData.team ? this.props.defaultData.team.teamLeaderEmail : null}
                        onChange={(e) => { this.handleChange(e, 'teamLeaderEmail') }}
                    />
                    <label htmlFor="team-leader-email">{'Team leader Email'}</label>
                </div>

                {this.state.error ? <p>{this.state.error}</p> : null}

                <Button
                    customClass="btn-green-white"
                    type={"submit"}
                >
                    {this.props.defaultData.team ? 'Edit Team' : 'Create Team'}
                </Button>
            </Form>
        );
    }
}

AdminTeamForm.propTypes = {
    title: React.PropTypes.string,
    defaultData: React.PropTypes.object,
};

export default connect((reduxState) => ({
    error: reduxState.main.team.error,
    team: reduxState.main.team.team,
}))(AdminTeamForm);
