import React, { Component } from 'react';
import classNames from 'classnames';
import * as constants from '../../common/constants';
import { Circle } from 'rc-progress';
import { dateType } from 'common/proptypes'
import moment from 'moment'

export default class UserProgress extends Component {
    render() {
        const {
            user,
            totalSponsors,
            goalDeadline,
        } = this.props

        const percentage = user.goal ? user.totalHours / user.goal * 100 : 0;

        let backgroundImage = user.image
                                    ? `url(${user.image})`
                                    : `url(${constants.USER_IMAGES_FOLDER}/${constants.DEFAULT_AVATAR})`;

        if (!backgroundImage.match(constants.DEFAULT_AVATAR)) {
            backgroundImage = `url(${constants.RESIZE_PROFILE}${user.image})`;
        }

        const $goalDeadline = goalDeadline ? (
            <div className="small">
                <time
                    dateTime={goalDeadline.toISOString()}
                    title={goalDeadline.toLocaleDateString()}
                >{`by ${moment(goalDeadline).format('MMM Do YYYY')}`}</time>
            </div>
        ) : null
        return (
            <div className="user-progress-container">
                <div className="user-hours">
                    <p>{"Sponsors "}<span className="user-hours__sponsors">{totalSponsors}</span></p>
                    <p>{"Hours to date "}<span className="user-hours__current">{Math.round(user.totalHours)}</span></p>
                </div>
                <div
                    className={classNames(
                        'user-progress',
                        {
                            'user-progress-circle__hidden': user.hours === 0,
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
                    <div className="user-name-and-goal">
                        <div className="user-name">{`${user.firstName} ${user.lastName}`}</div>
                        <div className="small">{`Goal: ${user.goal} Hrs of Service`}</div>
                        {$goalDeadline}
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
        totalHours: React.PropTypes.number,
        goal: React.PropTypes.number.isRequired,
    }).isRequired,
    goalDeadline: dateType,
    totalSponsors: React.PropTypes.number
};
UserProgress.defaultProps = {
    totalSponsors: 0,
}
