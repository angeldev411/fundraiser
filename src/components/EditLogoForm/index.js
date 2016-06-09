import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import Dropzone from 'react-dropzone';
import * as Actions from '../../redux/team/actions';
import { connect } from 'react-redux';

export default class EditLogoForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: {
                preview: this.props.value,
            },
            logo: this.props.value ? this.props.value : '',
            team: this.props.team,
            logoImageData: '',
            loading: false,
            cropperOpen: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.team) {
            this.setState({
                team: nextProps.team,
            });
        }
    }
    
    handlePickedFile = (Blob) => {
        const team = Object.assign({}, this.state.team);
        team.logo = Blob.url;
            Actions.updateTeam(
            team.id,
            team
        )(this.props.dispatch);
    };
    
    cropFile = () => {
        const team = Object.assign({}, this.state.team);
        filepicker.processImage(team.coverImage, {
            mimetype: 'image/*',
            services: ['CONVERT', 'COMPUTER'],
            conversions: ['crop', 'rotate']
        }, this.handlePickedFile.bind(this));
    };
    
    
    
    pickFile = () => {
      filepicker.pick(
        {
            mimetype: 'image/*',
            services: ['CONVERT', 'COMPUTER', 'FACEBOOK', 'WEBCAM'],
            conversions: ['crop', 'rotate']
        },
        this.handlePickedFile.bind(this)
        );  
    };

    

    render() {
        return (
            <Form title={'Edit Logo'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                id={"edit-logo-form"}
            >
                <img
                            className={"dropzone-image"}
                            src={this.state.file.preview}
                        />
                <Button
                    customClass="btn-green-white btn-lg"
                    onClick={this.pickFile}
                >
                    Upload Logo
                </Button>
            </Form>
        );
    }
}

EditLogoForm.propTypes = {
    value: React.PropTypes.string,
    updateTeam: React.PropTypes.func,
};

export default connect((reduxState) => ({
    team: reduxState.main.team.team,
    error: reduxState.main.team.error,
}))(EditLogoForm);
