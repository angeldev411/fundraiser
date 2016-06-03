import React, { Component } from 'react';
import classNames from 'classnames';
import * as constants from '../../common/constants';
import * as Urls from '../../urls.js';
import { Link } from 'react-router';

let node = null;
let previous = null;
let next = null;

export default class UserList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            previousVisible: false,
            nextVisible: false,
            mounted: false,
        };
    }

    componentDidMount() {
        node = document.getElementById('scrollable-user-list');
        previous = document.getElementById('previous');
        next = document.getElementById('next');
    }

    componentDidUpdate() {
        // Hide / show scroll buttons
        if (!this.state.mounted && (node.scrollWidth - node.offsetWidth) !== 0) {
            this.setState({
                mounted: true,
                nextVisible: true
            });
        }
    }

    componentWillUnmount() {
        node = null;
        previous = null;
        next = null;
    }

    animate = (increment) => {
        const endValue = node.scrollLeft + increment;

        const loop = setInterval(
            () => {
                node.scrollLeft += increment / 5;
                if (
                    node.scrollLeft === 0
                    || node.scrollLeft >= (node.scrollWidth - node.offsetWidth)
                    || (increment > 0 && node.scrollLeft > endValue)
                    || (increment < 0 && node.scrollLeft < endValue)
                ) {
                    clearInterval(loop);
                }

                // Hide / show scroll buttons
                if (node.scrollLeft === 0 && this.state.previousVisible === true) {
                    this.setState({ previousVisible: false });
                } else {
                    this.setState({ previousVisible: true });
                }

                if (node.scrollLeft >= (node.scrollWidth - node.offsetWidth) && this.state.nextVisible === true) {
                    this.setState({ nextVisible: false });
                } else {
                    this.setState({ nextVisible: true });
                }
            }, 30
        );
    };

    scrollLeft = () => {
        this.animate(-constants.USER_LIST_SCROLL_INCREMENT);
    };

    scrollRight = () => {
        this.animate(constants.USER_LIST_SCROLL_INCREMENT);
    };

    render() {
        if (this.props.volunteers) {
            return (
                <div className={`user-list clearfix color-${this.props.color}`}>
                    <div
                        className={classNames({
                            'scroll-button__visible': this.state.previousVisible,
                            'scroll-button__hidden' : !this.state.previousVisible,
                        })}
                        id="previous"
                        onClick={this.scrollLeft}
                    >
                        <i className="fa fa-chevron-left"/>
                    </div>

                    <ul id={'scrollable-user-list'}>
                        {this.props.volunteers.map((user, i) =>
                            (<li
                                className="user"
                                key={i}
                             >
                                <Link to={Urls.getVolunteerProfileUrl(this.props.projectSlug, this.props.teamSlug, user.slug)}>
                                    <div className="user-face"
                                        style={{ backgroundImage : user.image
                                            ? `url(${user.image})`
                                            : `url(${constants.USER_IMAGES_FOLDER}/${constants.DEFAULT_AVATAR})` }}
                                    >
                                        <div className="user-hours">
                                            <span className="user-hours-number">{ Math.round( user.totalHours || 0) }</span><br/>{'hours'}
                                        </div>
                                    </div>
                                    <div className="user-name">{`${user.firstName} ${user.lastName}`}</div>
                                    {this.props.noSponsor ? (null) : <span className="user-sponsor">{'Sponsor Me'}</span>}
                                </Link>
                            </li>)
                        )}
                    </ul>

                    <div
                        className={classNames({
                            'scroll-button__visible': this.state.nextVisible,
                            'scroll-button__hidden' : !this.state.nextVisible,
                        })}
                        id="next"
                        onClick={this.scrollRight}
                    >
                        <i className="fa fa-chevron-right"/>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

UserList.propTypes = {
    volunteers: React.PropTypes.array,
    teamSlug: React.PropTypes.string,
    projectSlug: React.PropTypes.string,
    onClick: React.PropTypes.func,
    color: React.PropTypes.string,
    noSponsor: React.PropTypes.bool,
};
