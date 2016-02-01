import React, { Component } from 'react';
import classNames from 'classnames';
import * as constants from '../../common/constants';
import { Circle } from 'rc-progress';

export default class UserProgress extends Component {
    render() {
        const percentage = this.props.user.hours / this.props.user.goal * 100;
        const backgroundImage = `url(${constants.USER_IMAGES_FOLDER}/${this.props.user.uniqid}/${this.props.user.image})`;

        return (
            <div className="user-progress-container">
                <div className="user-hours">
                    <p>{"Current Hours"} <span className="user-hours__current">{this.props.user.hours}</span></p>
                    <p>{"Goal Hours"} {this.props.user.goal}</p>
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
                        <div className="user-name">{this.props.user.name}</div>
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
        hours: React.PropTypes.number,
        goal: React.PropTypes.number,
    }),
};
