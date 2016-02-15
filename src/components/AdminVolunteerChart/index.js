import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import d3 from 'd3';
import classNames from 'classnames';

const goal = 140;
let totalHours = 0;
const graphData = [];

let currentDay = 1;
const currentMonth = 2; // February
const currentYear = 2016;

const SCROLL_INCREMENT = 50;
let node = null;
let previous = null;
let next = null;

export default class AdminVolunteerChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            previousVisible: false,
            nextVisible: false,
        };
    }

    componentWillMount() {
        this.prepareGraphData(this.props.data);
    }

    componentDidMount() {
        node = document.getElementById('graph');
        previous = document.getElementById('previous');
        next = document.getElementById('next');

        if (node.scrollWidth - node.offsetWidth !== 0) {
            this.setState({ nextVisible: true });
        }
    }

    componentWillUnmount() {
        node = null;
        previous = null;
        next = null;
    }

    getDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    prepareGraphData = (rawData) => {
        const daysInMonth = this.getDaysInMonth(currentMonth, currentYear);

        rawData.map(function(d) {
            // If date(s) missing, manually create date
            if (d.date.getDate() !== currentDay) {
                const diff = d.date.getDate() - currentDay;

                // Add missing item(s)
                for (let i = 0; i < diff; i++) {
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
            for (let i = 0; i < diff; i++) {
                graphData.push({
                    date: new Date(currentYear, currentMonth, currentDay),
                    new: 0,
                    total: totalHours,
                });
                currentDay++;
            }
        }
    };

    animate = (increment) => {
        const endValue = node.scrollLeft + increment;

        const loop = setInterval(
            () => {
                node.scrollLeft += increment / 5;
                if (
                    node.scrollLeft === 0
                    || node.scrollLeft >= (node.scrollWidth - node.offsetWidth)
                    || (increment > 0 && node.scrollLeft > endValue)
                    || (increment < 0 && node.scrollLeft < endValue)
                ) {
                    clearInterval(loop);
                }

                // Hide / show scroll buttons
                if (node.scrollLeft === 0 && this.state.previousVisible === true) {
                    this.setState({ previousVisible: false });
                } else {
                    this.setState({ previousVisible: true });
                }

                if (node.scrollLeft >= (node.scrollWidth - node.offsetWidth) && this.state.nextVisible === true) {
                    this.setState({ nextVisible: false });
                } else {
                    this.setState({ nextVisible: true });
                }
            }, 30
        );
    };

    scrollLeft = () => {
        this.animate(-SCROLL_INCREMENT);
    };

    scrollRight = () => {
        this.animate(SCROLL_INCREMENT);
    };

    render() {
        const container = ReactFauxDOM.createElement('div');

        // Width and height
        const barPadding = 5;
        const barWidth = 20;

        const w = this.getDaysInMonth(currentMonth, currentYear) * (barWidth + barPadding);
        const h = 320;

        let heightCoef = 0;

        if (totalHours < goal) {
            heightCoef = Math.floor(h / totalHours);
        } else {
            heightCoef = 1;
        }
        const borderRadius = 7;

        let svg = d3.select(container)
            .append('svg')
            .attr('width', w)
            .attr('height', h);

        svg.selectAll('bar')
            .data(graphData)
            .enter()
            .append('rect')
                .attr('x', function(d, i) {
                    return i * (barWidth + barPadding);
                })
                .attr('y', 0)
                .attr('width', barWidth)
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
                    return h - (d.total * heightCoef);
                })
                .attr('width', barWidth)
                .attr('height', function(d) {
                    return d.total * heightCoef;
                })
                .attr('rx', borderRadius)
                .attr('ry', borderRadius)
                .attr('fill', 'rgb(53, 51, 52)');

        svg.selectAll('new')
            .data(graphData)
            .enter()
            .append('rect')
                .attr('x', function(d, i) {
                    return i * (barWidth + barPadding);
                })
                .attr('y', function(d) {
                    return h - (d.total * heightCoef);
                })
                .attr('width', barWidth)
                .attr('height', function(d) {
                    return d.new * heightCoef;
                })
                .attr('rx', borderRadius)
                .attr('ry', borderRadius)
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
                .attr('transform', 'rotate(-90)');

        return (
            <div className={'graph-container'}>
                <div
                    className={classNames({
                        'scroll-button__visible': this.state.previousVisible,
                        'scroll-button__hidden' : !this.state.previousVisible,
                    })}
                    id="previous"
                    onClick={this.scrollLeft}
                >
                    <i className="fa fa-chevron-left"/>
                </div>

                <div id="graph">
                    {container.toReact()}
                </div>

                <div
                    className={classNames({
                        'scroll-button__visible': this.state.nextVisible,
                        'scroll-button__hidden' : !this.state.nextVisible,
                    })}
                    id="next"
                    onClick={this.scrollRight}
                >
                    <i className="fa fa-chevron-right"/>
                </div>
            </div>
        )
    }
}

AdminVolunteerChart.propTypes = {
    data: React.PropTypes.array,
};
