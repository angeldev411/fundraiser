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
      removedLeader: null,
      leaders: []
    }

    this.submit       = this.submit.bind(this);
    this.removeLeader = this.removeLeader.bind(this);
  }

  componentWillMount() {
    TeamActions.getLeaders(this.props.team.id)(this.props.dispatch);
  }

  componentWillReceiveProps(nextProps) {
    console.log('Got Props!', nextProps);

    if (nextProps.inviteError){
      this.setState({ inviteError: nextProps.error });
      return;
    } 

    if (nextProps.newLeader)
      TeamActions.getLeaders(this.props.team.id)(this.props.dispatch);

    if (nextProps.leaders)
      this.setState({ leaders: nextProps.leaders });
  }

  confirmRemove(email) {
    this.setState({ confirmRemove: email });
  }

  removeLeader(email) {
    console.log('Removing leader', email);
    this.setState({ confirmRemove: null });
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
            <div className="col-xs-6 col-md-3">
              <input ref="lastName" type="text" className="form-control" placeholder="Last"/>
            </div>
            <div className="col-xs-12 col-md-4">
              <input ref="email" type="email" className="form-control" placeholder="Email"/>
            </div>
            
            <div className="col-xs-12 col-md-3">
              <Button type='submit' className="btn-green-white" style={{marginTop:'5px', width:'100%'}}>
                Add Leader
              </Button>
            </div>

          </div>

        </Form>

        <div class="row">
          <h4 id="errors" className="col-xs-12 text-center">{this.state.inviteError}</h4>
        </div>

        <div id="team-leaders" class="row">
          <h3 className="text-center col-xs-12">{'Current Leaders'}</h3>

          { this.state.leaders.length ? (

            this.state.leaders.map( leader => leader.email ? (
              <div key={leader.email} className="row">
                <div className="col-xs-6 col-xs-offset-1 col-sm-4">{leader.firstName} {leader.lastName}</div>
                <div className="hidden-xs col-sm-5">{leader.email}</div>
                <div className="col-xs-5 col-sm-2">
                  { this.state.confirmRemove === leader.email ? (
                    
                    <button type="button" className="btn btn-link" 
                            onClick={() => { this.removeLeader(leader.email) }}>
                      are you sure?
                    </button>

                  ) : (
                    
                    <button type="button" className="btn btn-link" 
                            onClick={() => { this.confirmRemove(leader.email) }}>
                      remove
                    </button>
                    
                  )}
                </div>
              </div>
            ) : /* skip fake leaders without email addresses */( 
              null 
            ) )
            
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
    leaders:      reduxState.main.team.leaders,

    newLeader:    reduxState.main.team.newLeader,
    inviteError:  reduxState.main.team.inviteError,
    
    removedLeader:  reduxState.main.team.removedLeader
  };
})(ManageTeamLeaders);