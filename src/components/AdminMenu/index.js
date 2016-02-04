import React, { Component } from 'react';
import ModalButton from '../ModalButton';
import AdminProjectForm from '../AdminProjectForm';

export default class AdminMenu extends Component {
    render() {
        return (
            <nav className={'admin-navigation col-xs-12 col-lg-3'}>
                <ul className="admin-nav">
                    <li><a href="#">Projects</a></li>
                    <li><a href="#">All Sponsors</a></li>
                    <li><a href="#">All Volunteers</a></li>
                </ul>

                <ul className="page-nav">
                    <li>
                        <ModalButton type="btn-link"
                            content={<AdminProjectForm title={"Add New Project"}/>}
                        >
                            {'New project'}
                        </ModalButton>
                    </li>
                </ul>
            </nav>
        )
    }
}
