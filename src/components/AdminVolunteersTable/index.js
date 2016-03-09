import React, { Component } from 'react';
import ModalButton from '../ModalButton';
import AdminTeamEmailForm from '../AdminTeamEmailForm';
import * as constants from '../../common/constants';
import classNames from 'classnames';

export default class AdminVolunteersTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            linesChecked: [],
            checked: false,
            showDropdown: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.volunteers) {
            const lines = [];

            for (let i = 0; i < nextProps.volunteers.length; i++) {
                lines[i] = false;
                if (i === nextProps.volunteers.length - 1) {
                    this.setState({
                        linesChecked: lines,
                    });
                }
            }
        }
    }

    handleCheck(i) {
        const lines = this.state.linesChecked;

        lines[i] = !lines[i];
        this.setState({
            linesChecked: lines,
        });
    }

    handleCheckAll() {
        const lines = this.state.linesChecked;

        for (let i = 0; i < lines.length; i++) {
            lines[i] = !this.state.checked;

            if (i === lines.length - 1) {
                this.setState({
                    linesChecked: lines,
                });
            }
        }
        this.setState({
            checked: !this.state.checked,
        });
    }

    lockDropdown = () => {
        this.setState({
            showDropdown: !this.state.showDropdown,
        });
    };

    render() {
        const selectedVolunteers = [];

        for (let i = 0; i < this.state.linesChecked.length; i++) {
            if (this.state.linesChecked[i]) {
                selectedVolunteers.push(this.props.volunteers[i]);
            }
        }

        return (
            <div className="table-responsive">
                {this.props.actionable ?
                    <div className={'actions'}>
                        <div className="dropdown">
                            <span>
                                {'Actions'} <i className="fa fa-chevron-down"></i>
                            </span>
                            <ul className={
                                    classNames({
                                        'dropdown-content__active': this.state.showDropdown,
                                    }, 'dropdown-content')
                                }
                            >
                                <li>
                                    <ModalButton
                                        customClass="btn-link"
                                        content={
                                            <AdminTeamEmailForm
                                                project={this.props.user.project}
                                                team={this.props.user.team}
                                                recipients={selectedVolunteers}
                                            />
                                        }
                                        onModalToggle={this.lockDropdown}
                                    >
                                        {'Email'}
                                    </ModalButton>
                                </li>
                            </ul>
                        </div>
                    </div> : null
                }
                <table className="volunteers table">
                    <thead>
                        <tr>
                            <th>{'Member'}</th>
                            <th>{'Email'}</th>
                            <th>{'Hours'}</th>
                            <th>{'Sponsors'}</th>
                            <th>{'$ Raised'}</th>
                            <th>{'$/Hr'}</th>
                            {this.props.actionable ?
                                <th>
                                    <input
                                        type="checkbox"
                                        name={'check-all'}
                                        id={'check-all'}
                                        onChange={() => {
                                            this.handleCheckAll();
                                        }}
                                    />
                                </th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.volunteers.map((volunteer, i) => {
                            return (<tr key={i}>
                                <td className="volunteer-name">
                                    {volunteer.image ?
                                        <img src={`${constants.USER_IMAGES_FOLDER}/${volunteer.id}/${volunteer.image}`}/>
                                    :
                                        <img src={`${constants.USER_IMAGES_FOLDER}/${constants.DEFAULT_AVATAR}`}/>
                                    }
                                    {`${volunteer.firstName} ${volunteer.lastName}`}
                                </td>
                                <td className="volunteer-email">{volunteer.email}</td>
                                <td>{volunteer.hours ? volunteer.hours : 0}</td>
                                <td>{volunteer.sponsors ? volunteer.sponsors : 0}</td>
                                <td>{volunteer.raised ? volunteer.raised : 0}</td>
                                <td>{volunteer.hourPledge ? volunteer.hourPledge : 0}</td>
                                {this.props.actionable ?
                                    (<td>
                                        <input
                                            type="checkbox"
                                            name={volunteer.uniqid}
                                            id={i}
                                            onChange={() => {
                                                this.handleCheck(i);
                                            }}
                                            checked={this.state.linesChecked[i]}
                                        />
                                    </td>) : null}
                            </tr>);
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

AdminVolunteersTable.propTypes = {
    volunteers: React.PropTypes.array,
    user: React.PropTypes.object,
    actionable: React.PropTypes.bool,
};
