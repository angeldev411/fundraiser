import React, { Component } from 'react';

export default class SimpleLayout extends Component {
    render() {
        return (
            <div>
                <div className={`col-xs-12 simple-layout ${this.props.page}`}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

SimpleLayout.propTypes = {
    page: React.PropTypes.string,
};
