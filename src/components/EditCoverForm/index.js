import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import Dropzone from 'react-dropzone';
import * as Actions from '../../redux/team/actions';
import { connect } from 'react-redux';
import AvatarCropper from 'react-avatar-cropper';

export default class EditCoverForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: {
                preview: this.props.value ? `${this.props.value}` : '/assets/images/team/default-cover.png',
            },
            cover: this.props.value ? this.props.value : '',
            team: this.props.team,
            loading: false,
        };
    }
    
    handlePickedFile = (Blob) => {
        const team = Object.assign({}, this.state.team);
        team.coverImage = Blob.url;
            Actions.updateTeam(
            team.id,
            team
        )(this.props.dispatch);
    };
    
    cropFile = () => {
        const team = Object.assign({}, this.state.team);
        filepicker.processImage(team.coverImage, {
            cropRatio: 12/5,
            mimetype: 'image/*',
            services: ['CONVERT', 'COMPUTER'],
            conversions: ['crop', 'rotate']
        }, this.handlePickedFile.bind(this));
    };
    
    
    
    pickFile = () => {
      filepicker.pick(
        {
            cropRatio: 12/5,
            mimetype: 'image/*',
            services: ['CONVERT', 'COMPUTER', 'FACEBOOK', 'WEBCAM'],
            conversions: ['crop', 'rotate']
        },
        this.handlePickedFile.bind(this)
        );  
    };

    
    

    render() {
        return (
            <Form title={'Edit Cover'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                id={"edit-cover-form"}
            >
                <div className="dropzone form-group">


                        <img
                            className={"dropzone-image"}
                            src={this.state.file.preview}
                        />
                        &nbsp;
                        
                </div>
                <Button
                    customClass="btn-green-white btn-lg"
                    onClick={this.pickFile}
                >
                    Upload Cover
                </Button>
                
            </Form>
        );
    }
}

EditCoverForm.propTypes = {
    value: React.PropTypes.string,
    updateTeam: React.PropTypes.func,
};

export default connect((reduxState) => ({
    team: reduxState.main.team.team,
    error: reduxState.main.team.error,
}))(EditCoverForm);
