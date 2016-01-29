import React, { Component } from 'react';
import classNames from 'classnames';
import * as constants from '../../common/constants';
import { Circle } from 'rc-progress';

export default class UserProgress extends Component {
    render() {
        const percentage = this.props.user.hours / this.props.user.goal * 100;
        const backgroundImage = `url(${constants.USER_IMAGES_FOLDER}/${this.props.user.uniqid}/${this.props.user.image})`;

        return (
            <div
                className="user-progress"
            >
                <Circle
                    percent={percentage}
                    strokeWidth={constants.USER_PROGRESS_WIDTH}
                />
                <div
                    className="user-image"
                    style={{ backgroundImage }}
                >
                </div>
            </div>
        );
    }
}

UserProgress.propTypes = {
    user: React.PropTypes.shape({
        uniqid: React.PropTypes.string,
        image: React.PropTypes.string,
        hours: React.PropTypes.number,
        goal: React.PropTypes.number,
    }),
};
