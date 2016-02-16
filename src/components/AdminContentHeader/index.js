import React, { Component } from 'react';
import Button from '../../components/Button';
import Form from '../../components/Form';
import * as Constants from '../../common/constants.js';
import { Link } from 'react-router';
import * as Urls from '../../urls.js';

export default class AdminContentHeader extends Component {
    render() {
        if (this.props.goal) {
            return (
                <div className="content-header clearfix">
                    <h1 className="uppercase">{this.props.title}</h1>
                    {this.props.buttons}
                    <hr/>
                    <div className={'col-xs-12'}>
                        <p className={'pull-left col-xs-12 col-md-6'}>
                            {this.props.description}
                        </p>
                        <p className={'current-goal pull-left col-xs-12 col-md-6'}>
                            <Link to={Urls.ADMIN_VOLUNTEER_PROFILE_URL}>{'Edit'}</Link>
                            <span className={'goal-title'}>{'Current Goal'}</span>
                            <span className={'goal-number'}>{'250 hrs'}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return (
            <div className="content-header">
                <h1 className="uppercase">{this.props.title}</h1>
                {this.props.buttons}
                <hr/>
                <p>
                    {this.props.description}
                </p>
            </div>
        );
    }
}

AdminContentHeader.propTypes = {
    title: React.PropTypes.string,
    buttons: React.PropTypes.element,
    description: React.PropTypes.string,
    goal: React.PropTypes.bool,
};
