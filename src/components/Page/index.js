import React, { Component } from 'react';

import Header from '../Header';
import Footer from '../Footer';

export default class Page extends Component {
    constructor(props) {
        super(props);
        this.propTypes = {
            style: React.PropTypes.object
        }
    }



    render() {
        return (
            <div>
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
