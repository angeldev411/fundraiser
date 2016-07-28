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

    disabledUrl = () => {
      let team = this.props.defaultData.team;
      return team && team.totalVolunteers > 0 && 'disabled';
    }

    submit = () => {
        const team = Object.assign({}, this.props.defaultData.team);

        team.name = this.state.name;
        team.projectSlug = this.state.projectSlug;
        team.slug = this.state.slug;

        if (this.state.id) {
            Actions.updateTeam(
                this.state.id,
                {
                    id: this.state.id,
                    name: this.state.name,
                    projectSlug: this.props.defaultData.project.slug,
                    slug: this.state.slug,
                }
            )(this.props.dispatch);
        } else {
            Actions.newTeam(
                this.state.name,
                this.props.defaultData.project.slug,
                this.state.slug,
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
                        disabled={this.disabledUrl()}
                        className="urlInput"
                        name="slug"
                        id="slug"
                        aria-describedby="slug-addon"
                        defaultValue={this.props.defaultData.team ? this.props.defaultData.team.slug : null}
                        onChange={(e) => { this.handleChange(e, 'slug') }}
                    />
                     {
                        this.disabledUrl() ? 
                            <label className="urlInputLabel" htmlFor="slug">{'Public Url'} {'Note: Your team already has volunteers, URL is locked.'}</label> :
                            <label className="urlInputLabel" htmlFor="slug">{'Public Url'} {'Note: URL locks after you get your first volunteer'}</label>
                    }
                    <span className="lock input-group-addon">
                    {
                        this.disabledUrl() ? 
                        <i className="fa fa-lock" aria-hidden="true"></i>:
                        <i className="fa fa-unlock" aria-hidden="true"></i> 
                    }
                    </span>
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
