import React, { Component } from 'react';
import classNames from 'classnames';
import * as constants from '../../common/constants';
import { Circle } from 'rc-progress';

export default class UserProgress extends Component {
    render() {
        const percentage = this.props.user.goal ? this.props.user.totalHours / this.props.user.goal * 100 : 0;

        let backgroundImage = this.props.user.image
                                    ? `url(${this.props.user.image})`
                                    : `url(${constants.USER_IMAGES_FOLDER}/${constants.DEFAULT_AVATAR})`;

        if (!backgroundImage.match(constants.DEFAULT_AVATAR)) {
            backgroundImage = `url(${constants.RESIZE_PROFILE}${this.props.user.image})`;
        }

        return (
            <div className="user-progress-container">
                <div className="user-hours">
                    <p>{"Sponsors "}<span className="user-hours__sponsors">{this.props.totalSponsors}</span></p>
                    <p>{"Hours to date "}<span className="user-hours__current">{Math.round(this.props.user.totalHours)}</span></p>
                    <p>{"Goal hours "}<span className="user-hours__goal">{this.props.user.goal}</span></p>
                </div>
                <div
                    className={classNames(
                        'user-progress',
                        {
                            'user-progress-circle__hidden': this.props.user.hours === 0,
                        }
                    )}
                >
                    <Circle
                        percent={Math.min(percentage, 100)}
                        strokeWidth={constants.USER_PROGRESS_WIDTH}
                    />
                    <div
                        className="user-image"
                        style={{ backgroundImage }}
                    >
                    </div>
                    <div className="user-name-and-location">
                        <div className="user-name">{`${this.props.user.firstName} ${this.props.user.lastName}`}</div>
                        <div className="user-location">{this.props.user.location}</div>
                    </div>
                </div>
            </div>
        );
    }
}

UserProgress.propTypes = {
    user: React.PropTypes.shape({
        uniqid: React.PropTypes.string,
        image: React.PropTypes.string,
        currentHours: React.PropTypes.number,
        goal: React.PropTypes.number,
    }),
    totalSponsors: React.PropTypes.number
};
