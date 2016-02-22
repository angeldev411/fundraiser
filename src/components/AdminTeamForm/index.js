import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Form from '../../components/Form';
import * as Constants from '../../common/constants.js';
import * as Actions from '../../redux/team/actions';

class AdminTeamForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        } else if (nextProps.team) {
            // TODO Push new team]
            // this.setState(
            //     {
            //         user: nextProps.user,
            //         error: null
            //     }
            // );
        }
    }

    submit = () => {
        Actions.newTeam(
            this.state.name,
            this.state.slug,
            this.state.teamLeaderEmail,
        )(this.props.dispatch);
    };

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

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
                onSubmit={this.submit}
            >
                <div className="form-group">
                    <input type="text"
                        name="name"
                        id="name"
                        defaultValue={this.props.team ? this.props.team.name : null}
                        onChange={(e) => { this.handleChange(e, 'name') }}
                    />
                    <label htmlFor="name">{'Team Name'}</label>
                </div>

                <div className="input-group">
                    <span className="input-group-addon"
                        id="slug-addon"
                    >{`${domain}/${this.props.project.slug}/`}</span>
                    <input type="hidden"
                        name="projectSlug"
                        id="projectSlug"
                        value={this.props.project.slug}
                    />
                    <input type="text"
                        name="slug"
                        id="slug"
                        aria-describedby="slug-addon"
                        defaultValue={this.props.team ? this.props.team.slug : null}
                        onChange={(e) => { this.handleChange(e, 'slug') }}
                    />
                    <label htmlFor="slug">{'Public Url'}</label>
                </div>

                <div className="form-group">
                    <input type="email"
                        name="teamLeaderEmail"
                        id="teamLeaderEmail"
                        defaultValue={this.props.team ? this.props.team.teamLeaderEmail : null}
                        onChange={(e) => { this.handleChange(e, 'teamLeaderEmail') }}
                    />
                    <label htmlFor="team-leader-email">{'Team leader Email'}</label>
                </div>

                {this.state.error ? <p>{this.state.error}</p> : null}

                <Button
                    customClass="btn-green-white"
                    type={"submit"}
                >
                    {this.props.team ? 'Edit Team' : 'Create Team'}
                </Button>
            </Form>
        );
    }
}

AdminTeamForm.propTypes = {
    title: React.PropTypes.string,
    project: React.PropTypes.object,
    team: React.PropTypes.object,
};

export default connect((reduxState) => ({
    error: reduxState.main.team.error,
    team: reduxState.main.team.team,
}))(AdminTeamForm);
