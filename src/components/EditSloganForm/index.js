import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import * as Actions from '../../redux/team/actions';
import { connect } from 'react-redux';

export default class EditSloganForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slogan: this.props.value ? this.props.value : '',
            team: this.props.team,
            loading: false,
        };
    }

    updateSlogan = () => {
        this.setState({
            loading: true,
        });
        const team = Object.assign({}, this.state.team);

        team.slogan = this.state.slogan;
        Actions.updateTeam(
            this.state.team.id,
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
            <Form title={'Edit Slogan'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                id={"edit-slogan-form"}
                onSubmit={(e) => { this.updateSlogan() }}
            >
                <div className="form-group">
                    <div className="input-group">
                        <span
                            className="input-group-addon"
                            id="default-slogan"
                        >
                            {'YOU + US ='}
                        </span>
                        <input type="text"
                            name="slogan"
                            id="slogan"
                            defaultValue={this.props.value ? this.props.value : null}
                            onChange={(e) => { this.handleChange(e, 'slogan') }}
                        />
                        <label htmlFor="slogan">{'Slogan'}</label>
                    </div>
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

EditSloganForm.propTypes = {
    value: React.PropTypes.string,
};

export default connect((reduxState) => ({
    team: reduxState.main.team.team,
    error: reduxState.main.team.error,
}))(EditSloganForm);
