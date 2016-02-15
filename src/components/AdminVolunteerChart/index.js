import React, { Component } from 'react';
import AdminMenu from '../AdminMenu';
import ReactFauxDOM from 'react-faux-dom';
import * as Data from '../../common/test-data.js'; // TODO remove this
import d3 from 'd3';

let graphData = [];

let currentDay = 1;
const currentMonth = 2; // February
const currentYear = 2016;

export default class AdminVolunteerChart extends Component {
    componentWillMount() {
        this.prepareGraphData(this.props.data);
    }

    getDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    prepareGraphData = (rawData) => {
        let totalHours = 0;
        const daysInMonth = this.getDaysInMonth(currentMonth, currentYear);

        rawData.map(function(d) {
            // If date(s) missing, manually create date
            if (d.date.getDate() !== currentDay) {
                const diff = d.date.getDate() - currentDay;

                // Add missing item(s)
                for (var i = 0; i < diff; i++) {
                    graphData.push({
                        date: new Date(currentYear, currentMonth, currentDay),
                        new: 0,
                        total: totalHours,
                    });
                    currentDay++;
                }
            }

            // Increment totalHours
            totalHours += d.new;
            d.total = totalHours;

            // push data
            graphData.push(d);
            currentDay++;
        });

        if (!(currentDay > daysInMonth)) { // If month is incomplete
            const diff = daysInMonth - currentDay + 1;

            // Add missing item(s)
            for (var i = 0; i < diff; i++) {
                graphData.push({
                    date: new Date(currentYear, currentMonth, currentDay),
                    new: 0,
                    total: totalHours,
                });
                currentDay++;
            }
        }
    };

    render() {
        const container = ReactFauxDOM.createElement('div');

        //Width and height
        var w = '100%';
        var h = 320;
        var barPadding = 5;
        var barWidth = 20;


        var svg = d3.select(container)
            .append('svg')
            .attr('width', w)
            .attr('height', h);

        svg.selectAll('bar')
            .data(graphData)
            .enter()
            .append('rect')
                .attr('x', function(d, i) {
                    return i * (barWidth + barPadding); // i * (w / graphData.length)
                })
                .attr('y', 0)
                .attr('width', barWidth) // w / graphData.length - barPadding
                .attr('height', h)
                .attr('fill', 'rgb(110, 107, 108)');

        svg.selectAll('total')
            .data(graphData)
            .enter()
            .append('rect')
                .attr('x', function(d, i) {
                    return i * (barWidth + barPadding);
                })
                .attr('y', function(d) {
                    return h - (d.total * 4);
                })
                .attr('width', barWidth)
                .attr('height', function(d) {
                    return d.total * 4;
                })
                .attr('rx', 10)
                .attr('ry', 10)
                .attr('fill', 'rgb(53, 51, 52)');

        svg.selectAll('new')
            .data(graphData)
            .enter()
            .append('rect')
                .attr('x', function(d, i) {
                    return i * (barWidth + barPadding);
                })
                .attr('y', function(d) {
                    return h - (d.total * 4);
                })
                .attr('width', barWidth)
                .attr('height', function(d) {
                    return d.new * 4;
                })
                .attr('rx', 10)
                .attr('ry', 10)
                .attr('fill', 'rgb(189, 212, 66)');

        svg.selectAll('text')
            .data(graphData)
            .enter()
            .append('text')
                .text(function(d) {
                    const year = d.date.getFullYear();
                    let month = d.date.getMonth();
                    let day = d.date.getDate();

                    if (month.toString().length === 1) {
                        month = '0' + month;
                    }
                    if (day.toString().length === 1) {
                        day = '0' + day;
                    }

                    return year + '-' + month + '-' + day;
                })
                .attr('x', function(d, i) {
                    return -60;
                })
                .attr('y', function(d, i) {
                    return i * (barWidth + barPadding) + 15;
                })
                .attr('font-family', 'sans-serif')
                .attr('font-size', '11px')
                .attr('fill', 'white')
                .attr('transform', 'rotate(-90)' );

        return (
            <div id="graph">
                {container.toReact()}
            </div>
        )
    }
}

AdminVolunteerChart.propTypes = {
    data: React.PropTypes.array,
};
