import React, { Component } from 'react';
import Button from '../Button/';
import Pledge from '../Pledge/';

export default class PledgeButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clicked: false,
        };
    }

    togglePledge = () => {
        this.setState({ clicked: !this.state.clicked });
    };

    render() {
        if (this.state.clicked) {
            return (
                <div>
                    <div className={"container"}>
                        <div className="col-xs-12">
                            <Button type={this.props.type}>{this.props.children}</Button>
                        </div>
                    </div>
                    <Pledge status={'pledge__open'}
                        togglePledge={this.togglePledge}
                    />
                </div>
            );
        }
        return (
            <div>
                <div className={"container"}>
                    <div className="col-xs-12">
                        <Button type={this.props.type}
                            onClick={this.togglePledge}
                        >
                            {this.props.children}
                        </Button>
                    </div>
                </div>
                <Pledge status={'pledge__closed'} togglePledge={this.togglePledge}/>
            </div>
        );
    }
}

PledgeButton.propTypes = {
    type: React.PropTypes.string,
};
