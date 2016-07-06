import React, { Component } from 'react';

export default class Aside extends Component {

  render() {

    const isVolunteer = !!this.props.volunteerprofile;
    const volunteer = {
      subject:    isVolunteer ? 'I' : 'We',
      subjectLow: isVolunteer ? 'I' : 'we',
      possesive:  isVolunteer ? 'My': 'Our',
      object:     isVolunteer ? 'me': 'us',
      project:    this.props.project ? this.props.project.name : 'a great cause'
    };

    return (
      <aside className={'col-xs-12 col-lg-4 col-lg-pull-8'}>
          <section>
              <h2 className={'title'}>{`${volunteer.subject} Volunteer ${volunteer.possesive} Time`}</h2>
              <p>
                  {`${volunteer.subject}'ve made a pledge to perform service to help our community and raise money for ${volunteer.project}.`}
              </p>
          </section>
          <span className={'green-symbol'}>
              +
          </span>
          <section>
              <h2 className={'title'}>{!this.props.volunteerprofile ? 'You Sponsor Our Time' : 'You Sponsor My Time'}</h2>
              <p>
                {`You sponsor ${volunteer.object} for every service hour ${volunteer.subjectLow} volunteer. Your 100% tax deductible contribution goes directly to ${volunteer.project}.`}
              </p>
          </section>
          <span className={'green-symbol'}>
              =
          </span>
          <section>
              <h2 className={'title'}>{'Together We Make Twice the Difference'}</h2>
              <p>
                {`Your sponsorship means more than just money for a great cause.  It inspires ${volunteer.object} to better our community by doing service. Together we are building a better world.`}
              </p>
          </section>
      </aside>
    );
  }
}

Aside.propTypes = {
  project: React.PropTypes.object,
  team: React.PropTypes.object,
  volunteerprofile: React.PropTypes.bool
};
