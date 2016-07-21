import React from 'react';

export default class ThankYou extends React.Component {
  static propTypes = {
    sponsorFirstName: React.PropTypes.string.isRequired,
    isTeamDonation: React.PropTypes.bool,
    socialLinks: React.PropTypes.element.isRequired,
    volunteerFirstName: React.PropTypes.string,
    // teamLeadName: React.PropTypes.string,
    teamName: React.PropTypes.string,
  }
  render() {
    const {
      sponsorFirstName,
      isTeamDonation,
      socialLinks,
      volunteerFirstName,
      // teamLeadName,
      teamName,
    } = this.props
    return (
      <div id={'success-pledge'}>
        <p>{`${sponsorFirstName},`}</p>
        <p>
          {`Thank you for your sponsorship.  Sponsorships really inspire volunteering
            and together we are making twice the difference for the project. Your donation
            is 100% tax deductible and a tax receipt will be sent (to the email address you
            provided on your sponsorship form) by the end of the year.`}
        </p>
        <p>
          Please let your friends and family know about your sponsorship using the links
          below. Getting the word out will go along way making an even bigger impact.
        </p>
        {socialLinks}
        <p>
          You can see how many hours have been volunteered by following the sponsorship page.
          At the end of the campaign you will receive an email recap of the achievements.
        </p>
        <p>Thanks again,</p>
        {isTeamDonation ? <p>{teamName} Team Leader</p> : <p>{volunteerFirstName}</p>}
      </div>
    )
  }
}
