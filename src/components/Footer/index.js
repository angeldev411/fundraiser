import React, { Component } from 'react';
import * as Urls from '../../urls.js';
import * as constants from '../../common/constants';
import { Link } from 'react-router';

export default class Footer extends Component {
  render() {
    const YEAR = new Date().getFullYear();
    // TODO address microformat

    return (
      <footer>
        <div className="footer-content">
          <div className="container">
            <section className="hidden-xs col-xs-12 col-sm-4 col-md-3 col-lg-2">
              <span className="bloc-title">Who we are</span>
              <ul>
                <li>
                  <Link to={Urls.RAISERVE_BASICS}>raiserve Basics</Link>
                </li>
                <li>
                  <Link to={Urls.STORY}>Our Story</Link>
                </li>
                <li>
                  <Link to={Urls.FAQ}>FAQ</Link>
                </li>
              </ul>
            </section>
            <section className="hidden-xs col-xs-12 col-sm-4 col-md-3 col-lg-2">
              <span className="bloc-title">Get a hold of us</span>
              <ul>
                <li>
                  <p>
                    242 West 104th St<br/>
                    Suite 6ER<br/>
                    New York, NY 10025<br/>
                    804 537-2473
                  </p>
                </li>
                <li>
                  <hr/>
                </li>
                <li>
                  <a href={`mailto:${constants.CONTACT_EMAIL}`}>Ask Us</a>
                </li>
              </ul>
            </section>
            <section className="hidden-xs col-xs-12 col-sm-4 col-md-3 col-lg-2">
              <span className="bloc-title">The legal stuff</span>
              <ul>
                <li>
                  <Link to={Urls.LEGALS}>Terms of Service</Link>
                </li>
                <li>
                  <Link to={Urls.PRIVACY}>Privacy Policy</Link>
                </li>
                <li className="copyright">
                  {`© Copyright raiserve ${YEAR.toString()}`}
                </li>
              </ul>
            </section>
            <section className="col-xs-12 hidden-sm col-md-3 col-lg-2 col-lg-offset-4">
              <section className="col-xs-12 social visible-xs">
                <a href={constants.FACEBOOK_PAGE}>
                  <i className="fa fa-facebook"></i>
                </a>
                <a href={constants.TWITTER_PAGE}>
                  <i className="fa fa-twitter"></i>
                </a>
              </section>
              <Link to={Urls.BASE_URL} className="tagline uppercase">
                <img src="/assets/images/raiserve_logo_white_clock.png"
                  title=""
                  alt=""
                />
                <p>
                  Volunteers + Sponsors<br/>
                  = Twice the Difference
                </p>
              </Link>
            </section>
          </div>
        </div>
        <div className="footer-bottom hidden-xs">
          <div className="container">
            <section>
              <div className="col-xs-10 col-sm-8 col-md-9 volunteer">
                <small><span>Are you a volunteer in your community and want to start your own campaign? Contact us at </span>
                  <a
                    href={`mailto:${constants.VOLUNTEER_CONTACT_EMAIL}?subject=starting a campaign on raiserve`}
                  >{constants.VOLUNTEER_CONTACT_EMAIL}</a>
                </small>
              </div>
              <div className="col-xs-2 col-sm-4 col-md-3 social">
                <a href={constants.FACEBOOK_PAGE}>
                  <i className="fa fa-facebook"></i>
                </a>
                <a href={constants.TWITTER_PAGE}>
                  <i className="fa fa-twitter"></i>
                </a>
              </div>
            </section>
          </div>
        </div>
      </footer>
    );
  }
}
