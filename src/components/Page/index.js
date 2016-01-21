import React, { Component } from 'react';

import Header from '../Header';
import Footer from '../Footer';

export default class Page extends Component {
    render() {
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
    style: React.PropTypes.object
}
