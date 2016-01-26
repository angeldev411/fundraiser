import React, { Component } from 'react';

import Header from '../Header';
import Footer from '../Footer';

export default class Page extends Component {
    render() {
        if (this.props.noHeader) {
            return (
                <div id="page"
                    style={this.props.bodyBackground}
                >
                    <div className="page-content"
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
                <Header/>
                <div className="page-content"
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
    noHeader: React.PropTypes.boolean,
    bodyBackground: React.PropTypes.object,
};
