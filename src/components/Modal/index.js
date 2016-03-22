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
                        <button
                            type="button"
                            className="close"
                            onClick={this.props.onClick}
                        >
                            <img src="/assets/images/modal-close.png"/>
                        </button>
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
