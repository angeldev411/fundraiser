import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import * as Actions from '../../redux/team/actions';
import { connect } from 'react-redux';

export default class EditDescriptionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: this.props.value ? this.props.value : '',
            team: this.props.team,
            loading: false,
        };
    }

    updateDescription = () => {
        this.setState({
            loading: true,
        });
        const team = Object.assign({}, this.state.team);

        team.description = this.state.description;
        Actions.updateTeam(
            team.id,
            team
        )(this.props.dispatch);
    };

    handleChange = (event, name) => {
        const newState = {};

        newState[name] = event.nativeEvent.target.value;
        this.setState(newState);
    };

    render() {
        return (
            <Form title={'Edit Description'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                id={"edit-description-form"}
                onSubmit={(e) => { this.updateDescription() }}
            >
                <div className="form-group">
                    <textarea
                        name="description"
                        id="description"
                        defaultValue={this.props.value ? this.props.value : null}
                        rows="10"
                        onChange={(e) => { this.handleChange(e, 'description') }}
                    />
                    <label htmlFor="description">{'Description'}</label>
                </div>
                <Button
                    customClass="btn-green-white"
                    type={'submit'}
                    disabled={this.state.loading}
                >
                    {'save'}
                </Button>
            </Form>
        );
    }
}

EditDescriptionForm.propTypes = {
    value: React.PropTypes.string,
};

export default connect((reduxState) => ({
    team: reduxState.main.team.team,
    error: reduxState.main.team.error,
}))(EditDescriptionForm);
