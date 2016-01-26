import React, { Component } from 'react';

export default class Modal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className={'fullscreen-modal'}>
                    <div className="container">
                        <button type="button"
                            className="close"
                            onClick={this.props.onClick}
                        >
                            <i className="fa fa-times"></i>
                        </button>

                        {"Hello World!"}
                        {this.props.content}
                    </div>
                </div>
            </div>
        );
    }
}

Modal.propTypes = {
    onSubmit: React.PropTypes.func,
    content: React.PropTypes.element,
};
