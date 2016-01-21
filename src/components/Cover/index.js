import React, { Component } from 'react';

export default class Cover extends Component {
    render() {
        return (
            <div className={`cover ${this.props.customclass}`}
                style={this.props.image}
            >
                <div className={"cover-content container"}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Cover.propTypes = {
    image: React.PropTypes.object,
    customclass: React.PropTypes.string,
};
