import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import * as Actions from '../../redux/team/actions';
import { connect } from 'react-redux';


export default class EditTaglineForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tagline: this.props.value ? this.props.value : '',
            team: this.props.team,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        }
    }

    updateTagline = () => {
        const team = Object.assign({}, this.state.team);

        team.tagline = this.state.tagline;
        Actions.updateTagline(
            this.state.id,
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
            <Form title={'Edit Tagline'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                id={"edit-tagline-form"}
            >
                <div className="form-group">
                    <textarea
                        name="tagline"
                        id="tagline"
                        defaultValue={this.props.value ? this.props.value : null}
                        rows="3"
                        onChange={(e) => { this.handleChange(e, 'tagline') }}
                    />
                    <label htmlFor="tagline">{'Tagline'}</label>
                </div>
                <Button
                    customClass="btn-green-white"
                    type={'submit'}
                    onClick={(e) => { this.updateTagline() }}
                >
                    {'save'}
                </Button>
            </Form>
        );
    }
}

EditTaglineForm.propTypes = {
    value: React.PropTypes.string,
};

export default connect((reduxState) => ({
    error: reduxState.main.team.error,
}))(EditTaglineForm);
