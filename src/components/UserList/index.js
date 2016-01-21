import React, { Component } from 'react';
import { Link } from 'react-router';

export default class UserList extends Component {

    // TODO slider

    render() {
        const userImagedir = '/assets/images/samples';

        return (
            <ul className="user-list clearfix">
                <li className="previous">
                    <i className="fa fa-chevron-left"/>
                </li>

                {this.props.users.map(function(user, i) {
                    return (
                        <li className="user"
                            key={i}
                        >
                            <div className="user-face"
                                style={{ backgroundImage : `url(${userImagedir}/${user.image})` }}
                            >
                                <div className="user-hours">
                                    <span className="user-hours-number">{user.hours}</span><br/>{'hours'}
                                </div>
                            </div>
                            <div className="user-name">{user.name}</div>
                            <a href="#">{'Sponsor Me'}</a>
                        </li>
                    );
                })}

                <li className="next">
                    <i className="fa fa-chevron-right"/>
                </li>
            </ul>
        );
    }
}

UserList.propTypes = {
    users: React.PropTypes.array,
    onClick: React.PropTypes.func
};
