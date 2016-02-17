import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import Dropzone from 'react-dropzone';

export default class EditCoverForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: {
                preview: '/assets/images/team/default-cover.png',
            },
        };
    }

    onDrop = (files) => {
        this.setState({
            file: files[0],
        });
    };

    render() {
        return (
            <Form title={'Edit Cover'}
                cols={"col-xs-12 col-md-8 col-md-offset-2"}
                id={"edit-cover-form"}
            >
                <div className="dropzone form-group">
                    <Dropzone
                        onDrop={this.onDrop}
                        multiple={false}
                        style={{ }}
                    >
                        <img
                            className={"dropzone-image"}
                            src={this.state.file.preview}
                        />
                        <p className={"dropzone-text"}>{'Upload cover photo'}</p>
                    </Dropzone>
                </div>
                <Button
                    customClass="btn-green-white"
                    type={'submit'}
                >
                    {'save'}
                </Button>
            </Form>
        );
    }
}
