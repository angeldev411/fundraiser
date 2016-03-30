import React, { Component } from 'react';

export default class CollapsableLine extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: true,
        };
    }

    toggle = () => {
        this.setState({collapsed: !this.state.collapsed});
    };

    render() {
        return (
            <li className="collapsable clearfix">
                <div className={'col-xs-12'}>
                    <button
                        className={'expand btn-link pull-right'}
                        onClick={this.toggle}
                    >
                        {this.state.collapsed ? '+' : '–'}
                    </button>
                    {this.props.children}
                </div>
                {
                    this.state.collapsed ?
                    (null) :
                    this.props.childrenContent
                }
            </li>
        );
    }
}

CollapsableLine.propTypes = {
    childrenContent: React.PropTypes.element,
};
