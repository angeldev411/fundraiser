/* Import "logic" dependencies first */
import React, { Component } from 'react';

/* Then React components */
import Page from '../../components/Page';
import SimpleLayout from '../../components/SimpleLayout';

export default class Privacy extends Component {
    componentWillMount() {
        document.title = 'Privacy Policy | Raiserve';
    }

    render() {
        return (
            <Page>
                <div className={"container main-content no-cover"}>
                    <SimpleLayout page={'privacy'}>
                        <h1>{'Raiserve, INC.: PRIVACY POLICY'}</h1>
                        <section>
                            <p>
                                {'This Privacy Policy sets forth the policies of Raiserve, Inc. (‘Raiserve’) with respect to nonpublic personal information you provide to us through the Raiserve website (\'Website\'). Raiserve may update this Privacy Policy from time to time without providing notice to you, in which case the revised Privacy Policy will apply to information collected after the date the Privacy Policy is changed and posted. Updates will be posted to the Website and will be effective immediately. Your further use of the Website shall indicate your consent to such changes. If you do not agree with this Privacy Policy you may choose not to use the Website.'}
                            </p>
                            <p>
                                {'You may provide Raiserve with personal information, such as your name, address, and telephone number via the Website.'}
                            </p>
                            <p>
                                {'Raiserve does not disclose any of your personal information to anyone other than entities owned or controlled by Raiserve, and agents of Raiserve or to the extent required by law.'}
                            </p>
                            <p>
                                {'Raiserve may also collect certain information about you based upon your usage of the Website, such as the website that you just came from or that you next go to, the browser you are using, and your IP address. Collecting IP addresses is standard practice on the Internet, and is done automatically by many websites.'}
                            </p>
                            <p>
                                {'The Website may use \'cookies,\' which may automatically collect certain information and data. \'Cookies\' are small pieces of data sent to your computer browser from our web server and stored on your computer\'s hard drive. The data identifies you as a unique user and facilitates your ongoing access to and use of the Website. Cookies also help Raiserve diagnose problems with its servers. While your browser may accept cookies automatically, you can change the settings on your browser to prevent our cookies from being downloaded automatically, or to notify you that they are ready to be downloaded. The latter will give you the option of whether or not you want to accept our cookies. If you decide to decline our cookies, however, some of the Website\'s features or services may not function as they would have had you accepted our cookies.'}
                            </p>
                            <p>
                                {'Raiserve seeks to carefully safeguard your private information and, to that end, restrict access to nonpublic personal information about you to those employees and other persons who need to know the information to enable Raiserve to provide services to you. Raiserve maintains physical, electronic and procedural safeguards to protect your nonpublic personal information. Raiserve will preserve your personal information as required by law.'}
                            </p>
                            <p>
                                {'If you have any questions or comments about this Privacy Policy or the Website, please feel free to contact us at privacy@Raiserve.com.'}
                            </p>
                        </section>
                    </SimpleLayout>
                </div>
            </Page>
        );
    }
}
