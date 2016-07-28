import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

import Form from '../Form';
import Button from '../Button';

import * as TeamActions from '../../redux/team/actions'; 

export default class ManageTeamLeaders extends Component {

  static propTypes = {
    team: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      inviteError: null,
      newLeader: null,
      leaders: []
    }

    this.submit       = this.submit.bind(this);
    this.removeLeader = this.removeLeader.bind(this);
  }

  componentWillMount() {
    // TeamAction
  }

  componentWillReceiveProps(nextProps) {
    console.log('Got Props!', nextProps);

    if (nextProps.inviteError){
      this.setState({ inviteError: nextProps.error });
      return;
    } 

    if (nextProps.newLeader)
      alert('leader added!');
  }

  removeLeader(email) {
    console.log('Removing leader', email);
  }

  submit() {
    this.setState({ inviteError: null });

    // XXX: add validation
    const firstName   = this.refs.firstName.value;
    const lastName    = this.refs.lastName.value;
    const email       = this.refs.email.value;

    if (!(firstName.length && lastName.length && email.length)){
      this.setState({
        inviteError: 'All fields are required. Please try again.'
      });
      return;
    }

    TeamActions.inviteLeader(
      this.props.team.slug, 
      { firstName, lastName, email }
    )(this.props.dispatch);

    // reset the form after success
    this.refs.firstName.value = '';
    this.refs.lastName.value  = '';
    this.refs.email.value     = '';

  }

  render() {
    return (
      <div>
        <Form id="add-leader-form" ref="addLeaderForm"
          cols="col-xs-12"
          title="Manage team leaders"
          onSubmit={this.submit}
        >
        
          <div className="row">
          
            <div className="col-xs-6 col-md-2">
              <input ref="firstName" type="text" className="form-control" placeholder="First"/>
            </div>
            <div className="col-xs-6 col-md-2">
              <input ref="lastName" type="text" className="form-control" placeholder="Last"/>
            </div>
            <div className="col-xs-12 col-md-5">
              <input ref="email" type="email" className="form-control" placeholder="Email"/>
            </div>
            
            <div className="col-xs-12 col-md-3">
              <Button type='submit' className="btn-green-white" style={{marginTop:'5px', width:'100%'}}>
                Add Leader
              </Button>
            </div>

          </div>

        </Form>

        <h4 id="errors" className="text-center">{this.state.inviteError}</h4>

        <div id="team-leaders">
          <h3 className="text-center">{'Current Leaders'}</h3>

          { this.state.leaders.length ? (

            this.state.leaders.map( leader => (
              <div key={leader.email} className="row col-md-offset-3">
                <div className="col-xs-6 col-md-3">{leader.firstName} {leader.lastName}</div>
                <div className="col-xs-6 col-md-3">{leader.email}</div>
                <div className="col-xs-6 col-md-3">
                  <button type="button" className="btn btn-link" 
                          onClick={() => { this.removeLeader(leader.email) }}>
                    remove
                  </button>
                </div>
              </div>
            ))
            
          ) : (

            'No leaders have been invited yet.'
          )}

        </div>
      </div>
    );
  }
}

export default connect( (reduxState) => {
  console.log('reduxState', reduxState);
  return {
    newLeader: reduxState.main.team.newLeader,
    inviteError: reduxState.main.team.inviteError
  };
})(ManageTeamLeaders);