import React, { Component } from 'react';

import Header from '../Header';
import Footer from '../Footer';

export default class Page extends Component {
    componentDidMount() {
        const scrollToAnchor = () => {
            const hash = window.location.hash.substr(1);

            if (hash) {
                const el = document.getElementById(`${hash}`);

                if (el) {
                    el.scrollIntoView();
                }
            }
        };

        scrollToAnchor();
        window.onhashchange = scrollToAnchor;
    }

    render() {
        if (this.props.noHeader) {
            return (
                <div id="page"
                    style={this.props.bodyBackground}
                >
                    <div className="page-content clearfix"
                        style={this.props.style}
                    >
                        {this.props.children}
                    </div>
                    <Footer/>
                </div>
            );
        }

        return (
            <div id="page">
                <Header
                    greenHeader={this.props.greenHeader}
                    project={this.props.project}
                    team={this.props.team}
                />
                <div className="page-content clearfix"
                    style={this.props.style}
                >
                    {this.props.children}
                </div>
                <Footer/>
            </div>
        );
    }
}

Page.propTypes = {
    style: React.PropTypes.object,
    noHeader: React.PropTypes.bool,
    bodyBackground: React.PropTypes.object,
    greenHeader: React.PropTypes.string,
    project: React.PropTypes.object,
    team: React.PropTypes.object,
};
