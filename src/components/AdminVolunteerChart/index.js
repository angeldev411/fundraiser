import React, { Component } from 'react';
import AdminMenu from '../AdminMenu';
import ReactFauxDOM from 'react-faux-dom';
import * as Data from '../../common/test-data.js'; // TODO remove this
import d3 from 'd3';

export default class AdminVolunteerChart extends Component {
    render() {
        const list = ReactFauxDOM.createElement('ul')

        d3.select(list)
            .selectAll('li')
            .data(this.props.data) // 1, 2, 3...
            .enter()
            .append('li')
            .text(function (d) {
                return d
            })

        return (
            <div>
                {list.toReact()}
            </div>
        )
    }
}

AdminVolunteerChart.propTypes = {
    data: React.PropTypes.array,
};
