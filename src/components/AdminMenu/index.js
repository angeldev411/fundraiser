import React, { Component } from 'react';
import { Link } from 'react-router';
import ModalButton from '../ModalButton';

export default class AdminMenu extends Component {
    render() {
        return (
            <nav className={'admin-navigation col-xs-12 col-lg-3'}>
                <ul className="admin-nav">
                    {this.props.adminNav.map((link, i) => (
                        <li key={i}>
                            <Link to={link.href}>
                                {link.title}
                            </Link>
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
                                    >
                                        {element.title}
                                    </ModalButton>
                                    : <a href={element.href}>
                                        {element.title}
                                    </a>
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
};
