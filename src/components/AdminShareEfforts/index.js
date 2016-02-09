import React, { Component } from 'react';
import { Link } from 'react-router';

export default class AdminShareEfforts extends Component {
    // TODO define share data.
    render() {
        return (
            <div className="share-efforts">
                <span className="title uppercase">{'Share your efforts'}</span>
                <p>{'The more you tout your efforts, the more sponsors you will get.'}</p>
                <a href="#"><i className="fa fa-facebook-square"></i></a>
                <a href="#"><i className="fa fa-twitter-square"></i></a>
            </div>
        );
    }
}
