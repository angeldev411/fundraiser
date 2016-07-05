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

    onPledgeSuccess(){
      if (this.props.onPledgeSuccess) this.props.onPledgeSuccess();
      console.log('closing the pledge input');
      this.togglePledge();
    }

    togglePledge = () => {
      this.setState({
        clicked:    !this.state.clicked,
        visibility: this.state.clicked ? '' : 'hidden'
      });
      if(!this.state.clicked) this.refs.pledge.focusInput();
    };

    render() {
        return (
            <div>
                <div className={"container"}>
                    <div className={`col-xs-12 sponsorContainer ${this.state.visibility}`}>
                        <Button
                            customClass={this.props.customClass}
                            onClick={this.togglePledge}
                        >{this.props.children}</Button>
                    </div>
                </div>
                <Pledge
                    open={this.state.clicked}
                    ref="pledge"
                    togglePledge={this.togglePledge}
                    teamSlug={this.props.teamSlug}
                    volunteerSlug={this.props.volunteerSlug}
                    oneTimeOnly={this.props.oneTimeOnly}
                    goal={this.props.goal}
                    deadline={this.props.deadline}

                    volunteer={this.props.volunteer}
                    team={this.props.team}
                    project={this.props.project}

                    onPledgeSuccess={this.onPledgeSuccess.bind(this)}
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
    deadline: React.PropTypes.string,

    volunteer: React.PropTypes.object,
    team: React.PropTypes.object.isRequired,
    project: React.PropTypes.object.isRequired,

    onPledgeSuccess: React.PropTypes.func
};
