import React, { Component } from 'react';
import { Link } from 'react-router';
import * as Urls from '../../urls.js';

export default class AdminContentHeader extends Component {
    render() {
        return (
            <div className="content-header clearfix">
                <h1 className="uppercase">{this.props.title}</h1>
                {this.props.buttons}
                <hr/>
                {this.props.volunteerDashboard ?
                    <div className={'col-xs-12'}>
                        <p className={'pull-left col-xs-12 col-md-6'}>
                            {this.props.description}
                        </p>
                        <p className={'current-goal pull-left col-xs-12 col-md-6'}>
                            <Link to={`${Urls.ADMIN_USER_PROFILE_URL}#edit-goal`}>{'Edit'}</Link>
                            <span className={'goal-title'}>{'Current Goal'}</span>
                            <span className={'goal-number'}>{this.props.goal ? `${this.props.goal} hrs` : 'None'} </span>
                        </p>
                    </div>
                :
                    <p>
                        {this.props.description}
                    </p>
                }
            </div>
        );
    }
}

AdminContentHeader.propTypes = {
    title: React.PropTypes.string,
    buttons: React.PropTypes.element,
    description: React.PropTypes.string,
    volunteerDashboard: React.PropTypes.bool,
    goal: React.PropTypes.number,
};
