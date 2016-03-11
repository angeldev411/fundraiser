import React, { Component } from 'react';
import ModalButton from '../ModalButton';
import AdminTeamEmailForm from '../AdminTeamEmailForm';
import * as constants from '../../common/constants';
import classNames from 'classnames';
import * as Actions from '../../redux/volunteer/actions';
import { connect } from 'react-redux';


export default class AdminApproveHours extends Component {

    constructor(props) {
        super(props);
        this.state = {
            linesChecked: [],
            checked: false,
            showDropdown: false,
            team: props.team,
        };
    }

    componentWillMount() {
        document.title = 'Dashboard | Raiserve';
        Actions.getHoursNotApproved(
            this.state.team.id,
        )(this.props.dispatch);
    }

    componentWillReceiveProps(nextProps) {
        console.log('NextProps', nextProps);
        if (nextProps.hoursData) {
            const lines = [];

            for (let i = 0; i < nextProps.hoursData.length; i++) {
                lines[i] = false;
                if (i === nextProps.hoursData.length - 1) {
                    this.setState({
                        linesChecked: lines,
                    });
                }
            }
            this.setState({
                hoursData: nextProps.hoursData,
            });
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

    approveHour(hourIndex) {
        const hour = Object.assign({}, this.state.hoursData[hourIndex]);
        const newState = Object.assign({}, this.state);

        hour.approved = true;

        newState.hoursData[hourIndex] = hour;

        Actions.approveHour(
            hour.id,
        )(this.props.dispatch);

        this.setState(newState);
    }

    approveAllChecked() {
        for (const i in this.state.linesChecked) {
            if (this.state.linesChecked[i]) {
                this.approveHour(i);
            }
        }
    }

    render() {
        return (
            <div className={`form-container hours-table-container`}>
                <h2>{'APPROVE YOUR TEAM\'S\n VOLUNTEERED HOURS'}</h2>
                <p>{'You can batch approve or approve individual members here. For historical hours volunteered go to your team page.'}</p>
                <div className="hours-table-wrapper table-responsive">
                    <table className="hours table">
                        <thead>
                            <tr>
                                <th>{'Member'}</th>
                                <th>{'Date'}</th>
                                <th>{'Supervisor'}</th>
                                <th>{'Location'}</th>
                                <th>{'Hours'}</th>
                                <th onClick={(e) => {
                                    this.setState({
                                        showDropdown: !this.state.showDropdown,
                                    });
                                }}>{'Action'} <i className="fa fa-chevron-down"></i>
                                    <ul className={`dropdown${this.state.showDropdown ? ' show' : ''}`}>
                                        <li>
                                            <button onClick={(e) => {
                                                this.setState({
                                                    showDropdown: false,
                                                });
                                                this.approveAllChecked();
                                            }}>Approve Checked</button>
                                        </li>
                                    </ul>
                                </th>
                                <th>
                                    <input
                                        type="checkbox"
                                        name={'check-all'}
                                        id={'check-all'}
                                        onChange={() => {
                                            this.handleCheckAll();
                                        }}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.hoursData ? this.state.hoursData.map((hour, i) => {
                                if (hour.approved) {
                                    return null;
                                }
                                return (<tr key={i}>
                                    <td className="volunteer-name">
                                        {hour.user.image ?
                                            <img src={`${constants.USER_IMAGES_FOLDER}/${hour.user.id}/${hour.user.image}`}/>
                                        :
                                            <img className="picture" src={`${constants.USER_IMAGES_FOLDER}/${constants.DEFAULT_AVATAR}`}/>
                                        }
                                        <span className="username">{`${hour.user.firstName} ${hour.user.lastName}`}</span>
                                    </td>
                                    <td>{hour.date.split('T')[0]}</td>
                                    <td><img className="signature" src={hour.signature_url} alt=""/></td>
                                    <td>{hour.place}</td>
                                    <td>{hour.hours} {hour.hours > 1 ? 'Hours' : 'Hour'}</td>
                                    <td onClick={(e) => {
                                        this.approveHour(i)
                                    }}>{'APPROVE'}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name={hour.user.uniqid}
                                            id={i}
                                            onChange={() => {
                                                this.handleCheck(i);
                                            }}
                                            checked={this.state.linesChecked[i]}
                                        />
                                    </td>
                                </tr>);
                            }) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}


AdminApproveHours.propTypes = {
    user: React.PropTypes.object,
};

export default connect((reduxState) => ({
    hoursData: reduxState.main.volunteer.hoursData,
}))(AdminApproveHours);
