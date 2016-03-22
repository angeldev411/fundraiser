import React, { Component } from 'react';
import { Link } from 'react-router';

export default class AdminShareEfforts extends Component {
    // TODO define share data.
    render() {
        return (
            <section className="share-efforts">
                <span className="title uppercase">{'Share your efforts'}</span>
                <p>{'The more you tout your efforts, the more sponsors you will get.'}</p>
                <a href="#"><img src="/assets/images/facebook.png"/></a>
                <a href="#"><img src="/assets/images/twitter.png"/></a>
            </section>
        );
    }
}
