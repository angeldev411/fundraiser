import React, { Component } from 'react';
import Button from '../Button/';
import Pledge from '../Pledge/';

export default class PledgeButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clicked: false,
        };
        this.visibility = '';

    }

    togglePledge = () => {
        this.setState({ clicked: !this.state.clicked });

        if(this.state.clicked) this.setState({visibility: ''});
        else this.setState({visibility: 'hidden'});
    };

    render() {
        return (
            <div>
                <div className={"container"}>
                    <div className={`col-xs-12 sponsorContainer ${this.state.visibility}`}>
                        <Button
                            customClass={this.props.customClass}
                            onClick={!this.state.clicked ? this.togglePledge : null}
                        >{this.props.children}</Button>
                    </div>
                </div>
                <Pledge open={this.state.clicked}
                    togglePledge={this.togglePledge}
                    teamSlug={this.props.teamSlug}
                    volunteerSlug={this.props.volunteerSlug}
                    oneTimeOnly={this.props.oneTimeOnly}
                    goal={this.props.goal}
                    deadline={this.props.deadline}
                />
            </div>
        );
    }
}

PledgeButton.propTypes = {
    customClass: React.PropTypes.string,
    teamSlug: React.PropTypes.string,
    volunteerSlug: React.PropTypes.string,
    oneTimeOnly: React.PropTypes.bool,
    goal: React.PropTypes.number,
    deadline: React.PropTypes.string
};
