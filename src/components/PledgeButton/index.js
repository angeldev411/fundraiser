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
        return (
            <div>
                <div className={"container"}>
                    <div className="col-xs-12">
                        <Button
                            type={this.props.type}
                            onClick={!this.state.clicked ? this.togglePledge : null}
                        >{this.props.children}</Button>
                    </div>
                </div>
                <Pledge open={this.state.clicked}
                    togglePledge={this.togglePledge}
                />
            </div>
        );
    }
}

PledgeButton.propTypes = {
    type: React.PropTypes.string,
};
