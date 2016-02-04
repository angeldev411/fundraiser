/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../../components/Page';
import AdminLayout from '../../../components/AdminLayout';
import AdminProjectForm from '../../../components/AdminProjectForm';
import AdminVolunteersTable from '../../../components/AdminVolunteersTable';
import AdminContentHeader from '../../../components/AdminContentHeader';

// TODO dynamic volunteer
const volunteer = {
    name: 'Heather Miller',
    email: 'heather.miler@gmail.com',
    uniqid: 'samples',
    image: 'user.jpg',
    hours: 80,
    goal: 240,
    raised: 264,
    hourPledge: 15,
    sponsors: 141,
    location: 'York, Pa',
    message: 'Personal Message Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. tecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
    team: {
        name: 'Habitat for Humanity',
        uniqid : 'samples',
        slug: 'example',
        logo: 'team_logo.png',
        coverImage : 'team_cover.jpg',
        tagline: 'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        slogan: 'LOVE + HELP = MONEY FOR THE HOMELESS',
        description: 'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat',
    },
};

export default class SuperAdminVolunteers extends Component {
    componentWillMount() {
        document.title = 'Volunteers | Raiserve';
    }

    render() {
        const volunteers = [];

        // Create array of volunteers
        for (let i = 0; i < 20; i++) {
            volunteers.push(volunteer);
        }

        return (
            <Page>
                <AdminLayout>
                    <AdminContentHeader title={'Volunteers'}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <AdminVolunteersTable volunteers={volunteers}
                        editable={false}
                    />
                </AdminLayout>
            </Page>
        );
    }
}
