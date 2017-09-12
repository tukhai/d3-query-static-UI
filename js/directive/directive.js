(function() {
	'use strict';

	angular.module('d3App.directives')
		.directive('d3Lines',['d3', function(d3) {
			return {
				restrict : 'E',
				template: '<div id="d3-lines"></div>',
				replace: true,
				link : function(scope, element) {
					var lines = [];
					var maxValue = 450;
					var interval = 25;
					var lineLength = 12;
					var color = d3.scale.category10();
					var lineCount = 2;

					// generate n random lines
					generateLines(lineCount);

					window.onresize = function() {
						render();
					};
					render();

					function generateLines(lineCount) {
						for (var lineIndex = 0; lineIndex < lineCount; lineIndex++) {
							lines[lineIndex] = [];
							for (var pointIndex = 0; pointIndex < lineLength; pointIndex++) {
								lines[lineIndex].push(Math.round(Math.random() * maxValue / interval) * interval);
							}
						}
					}

					function render() {
						var width = element[0].offsetWidth, height = element[0].offsetHeight, margin = 45;

						// creating a div to contain line charts.
						angular.element(element[0].querySelector('svg')).remove();
						var div = d3.select(element[0]);

						var svg = div.append('svg:svg')
							.attr('width', width)
							.attr('height', height)
							.style('background-color', '#eee')
							.on('mousemove', renderTooltip)
							.on('mouseout', removeTooltip);

						// y range
						var yrange = d3.scale
							.linear()
							.domain([ 0, maxValue ])
							.range([ 
								0 + margin,
								height - margin 
							]);

						// x range
						var xrange = d3.scale
							.linear()
							.domain([ 0, lineLength ])
							.range([ 0 + margin, width - margin ]);

						renderAxes();
						lines.forEach(renderLine);

						function renderAxes() {
							var g = svg.append("svg:g")
								.style('stroke', 'grey')
								.style('fill', 'none');

							// draw the y axis
							g.append("svg:line")
								.attr("x1",xrange(0))
								.attr("y1", yrange(0))
								.attr("x2", xrange(0))
								.attr("y2",yrange(maxValue));

							// draw the x axis
							g.append("svg:line")
								.attr("x1",xrange(0))
								.attr("y1",height - yrange(0))
								.attr("x2",width - margin)
								.attr("y2",height - yrange(0));

							// x-axis label
							g.selectAll(".xLabel")
								.data(xrange.ticks(5))
								.enter()
								.append("svg:text")
								.attr("class","xLabel")
								.text(String)
								.attr("x", function(d) {
									return xrange(d)
								})
								.attr("y",height - margin+ 20)
								.style('stroke-width', 0)
								.style('fill', '#000')
								.attr("text-anchor","middle");

							// y-axis label
							g.selectAll(".yLabel")
								.data(yrange.ticks(5))
								.enter()
								.append("svg:text")
								.attr("class","yLabel")
								.text(String)
								.attr("x", margin - 5)
								.attr("y", function(d) {
									return height - yrange(d)
								})
								.attr("text-anchor","end")
								.style('stroke-width', 0)
								.style('fill', '#000');

							// x axis ticks
							g.selectAll(".xTicks")
								.data(xrange.ticks(10))
								.enter()
								.append("svg:line")
								.attr("class", "xTicks")
								.attr("x1", function(d) {
									return xrange(d);
								})
								.attr("y1", height - yrange(0))
								.attr("x2", function(d) {
									return xrange(d);
								})
								.attr("y2", height - yrange(0) + 5);

							// draw the y ticks
							g.selectAll(".yTicks")
								.data(yrange.ticks(10))
								.enter()
								.append("svg:line")
								.attr("class", "yTicks")
								.attr("y1", function(d) {
									return yrange(d);
								})
								.attr("x1", xrange(0) - 5)
								.attr("y2", function(d) {
									return yrange(d);
								})
								.attr("x2", xrange(0));
						}

						var highlightGroup = svg.append('svg:g');
						var highlight = highlightGroup
							.append('line')
							.attr('class', 'highlight')
							.attr('stroke', 'grey')
							.attr('stroke-width', 1)
							.attr('opacity', 0);

						var tooltip = d3.select('#tooltip');

						function renderTooltip() {
							var pointIndex = Math.round(xrange.invert(d3.mouse(svg.node())[0]));
							if (pointIndex == lineLength) return;
							var x = xrange(pointIndex);
							highlight
								.attr('opacity', 1)
								.attr('x1', x)
								.attr('y1', height - yrange(maxValue))
								.attr('x2', x)
								.attr('y2', height - yrange(0));

							var color = d3.scale.category10();

							var tooltipElement = angular.element(document.querySelector('#tooltip'));
							tooltipElement.css('left', (d3.event.pageX + 20) + 'px');
							tooltipElement.css('top', (d3.event.pageY - 20) + 'px');
							tooltipElement.css('visibility', '');

							tooltip
								.html('<span class="column">' + pointIndex + '</span>')
								.selectAll()
								.data(lines.map(function(line) { return line[pointIndex]; }))
								.enter()
								.append('div')
								.html(function(d, i) { 
									return '<div class="row">'
										+ '<span class="color-square" style="background-color: ' + color(i) + '"></span>'
										+ '<span class="title"> SampleData' + (i + 1) + '</span>'
										+ '<span class="value">' + d + '</span>'
										+ '</div>'
								});
						}

						function removeTooltip() {
							highlight.attr('opacity', 0);
							angular.element(document.querySelector('#tooltip')).css('visibility', 'hidden');
						}

						function renderLine(data, lineIndex) {
							var lineColor = color(lineIndex);;
							var lineGraph = d3.svg
								.line()
								.x(function(d, i) {
									return xrange(i);
								})
								.y(function(d) {
									return height - yrange(d);
								});

							var lineGroup = svg.append('svg:g');

							var line = lineGroup.append("svg:path")
								.attr("d", lineGraph(data))
								.style('stroke-width', 1)
								.style('stroke', lineColor)
								.style('fill', 'none');

							var pointGroup = svg.append('svg:g');

							var points = pointGroup.selectAll('.data-point')
								.data(data)
								.enter()
								.append('svg:circle')
								.attr('cx', function(d, i) { return xrange(i); })
								.attr('cy', function(d) { return height - yrange(d); })
								.attr('r', function() { return 4; })
								.style('fill', lineColor)
								.style('stroke-width', 0);
						}
					}
				}
			};
		} 
	]);
}());
