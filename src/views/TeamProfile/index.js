/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';

/* Then React components */
import Page from '../../components/Page';
import Cover from '../../components/Cover';
import Layout34 from '../../components/Layout34';
import UserList from '../../components/UserList';

/* Then view-related stuff */
export default class TeamProfile extends Component {
    componentWillMount() {
        document.title = 'TeamProfileNameHere | Raiserve';
    }

    render() {
        // TODO dynamic users
        const users = [];

        // Create array of users
        for (var i=0; i < 5; i++) {
            users.push({ name: 'Heather Miller', image: 'user.jpg', hours: 240 });
        }

        return (
            <Page>
                <Cover image={"url(/assets/images/samples/team_cover.jpg)"}
                    customclass={"cover-profile"}
                    tagline={"I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                    button={"Sponsor Now"}
                />
                <div className={"main-content"}>
                    <div className={"container"}>
                        <Layout34 page={'teamprofile'}>
                            <img id="team-logo"
                                src="/assets/images/samples/team_logo.png"
                                title=""
                            />
                            <h2>{'LOVE + HELP = MONEY FOR THE HOMELESS'}</h2>
                            <h3>{'Habitat for Humanity'}</h3>
                            <p>
                                {'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat'}
                            </p>
                        </Layout34>
                    </div>

                    <div className="team-block">
                        <div className={"container"}>
                            <div className="team">
                                <div className={'team-header'}>
                                    <span className="team-title">{'Team of volunteers'}</span>
                                    <span className="team-share">{'Share our goal'}</span>
                                    <i className="fa fa-mail"/>
                                    <i className="fa fa-facebook"/>
                                    <i className="fa fa-twitter"/>
                                </div>
                                <UserList users={users}/>
                            </div>
                        </div>
                    </div>
                </div>
            </Page>
        );
    }
}

TeamProfile.propTypes = {
    show: React.PropTypes.bool,
};
