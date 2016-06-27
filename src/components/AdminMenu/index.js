import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import ModalButton from '../ModalButton';
import classNames from 'classnames';

class AdminMenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav className={'admin-navigation col-xs-12 col-lg-3'}>
                <ul className="admin-nav">
                    {this.props.adminNav.map((link, i) => (
                        <li key={i}>
                            {link.type === 'button' ?
                                <ModalButton customClass="btn-link"
                                    content={link.content}
                                    onModalToggle={element.onModalToggle}
                                    onHourLogSuccess={element.onHourLogSuccess}
                                >
                                    {link.title}
                                </ModalButton> :
                                <Link
                                    to={link.href}
                                    className={classNames({
                                        active: this.props.path === link.href,
                                    })}
                                >
                                    {link.title}
                                </Link>
                            }
                        </li>
                    ))}
                </ul>
                {this.props.pageNav ?
                    (<ul className="page-nav">
                        {this.props.pageNav.map((element, i) => (
                            <li key={i}>
                                {element.type === 'button' ?
                                    <ModalButton customClass="btn-link"
                                        content={element.content}
                                        onModalToggle={element.onModalToggle}
                                        onHourLogSuccess={element.onHourLogSuccess}
                                    >
                                        {element.title}
                                    </ModalButton> :
                                    <Link
                                        to={element.href}
                                        className={classNames({
                                            active: this.props.path === element.href,
                                        })}
                                    >
                                        {element.title}
                                    </Link>
                                }
                            </li>
                        ))}
                    </ul>)
                : (null)}
            </nav>
        );
    }
}

AdminMenu.propTypes = {
    adminNav: React.PropTypes.array,
    pageNav: React.PropTypes.array,
    onHourLogSuccess: React.PropTypes.func
};

export default connect((reduxState) => ({
    path: reduxState.routing.path,
}))(AdminMenu);
