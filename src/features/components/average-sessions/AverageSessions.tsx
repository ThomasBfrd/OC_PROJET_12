import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { dayTransform } from "../../../app/core/interfaces/user-average";
import './AverageSessions.scss';

const LineChartWithHover = () => {
  const chartRef = useRef();

  useEffect(() => {
    const originalData2 = {
      userId: 12,
      sessions: [
        { day: 1, sessionLength: 30 },
        { day: 2, sessionLength: 23 },
        { day: 3, sessionLength: 45 },
        { day: 4, sessionLength: 50 },
        { day: 5, sessionLength: 0 },
        { day: 6, sessionLength: 0 },
        { day: 7, sessionLength: 60 },
      ],
    };

    const data = [
      { day: "START", sessionLength: originalData2.sessions[0].sessionLength },
      ...originalData2.sessions,
      { day: "END", sessionLength: originalData2.sessions[originalData2.sessions.length - 1].sessionLength },
    ];

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 250;
    const height = 250 - margin.top - margin.bottom;

    d3.select(chartRef.current).select("svg").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom);

      const highlightArea = svg
      .append("rect")
      .attr("width", 0)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "hightlightArea")
      .attr("y", 0)
      .attr("fill", "rgba(0, 0, 0, 0.2)")
      .style("pointer-events", "none");

    const chartArea = svg
      .append("g")
      .attr("transform", "translate(0, 20)");

    const xOriginal = d3
      .scalePoint()
      .domain(originalData2.sessions.map((d) => dayTransform[d.day]))
      .range([0, width])
      .padding(0.5);

    const x = d3
      .scalePoint()
      .domain(data.map((d) => d.day))
      .range([-20, width + 20])
      .padding(0);

    const y = d3.scaleLinear().domain([0, 70]).range([height, 0]);

    const line = d3
      .line()
      .x((d) => x(d.day))
      .y((d) => y(d.sessionLength))
      .curve(d3.curveCatmullRom);

    chartArea
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("transform", `translate(0, -20)`)
      .attr("d", line);

    chartArea
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(xOriginal)
          .tickSize(0)
          .tickPadding(10)
      )
      .selectAll("text")
      .style("fill", "white");

    chartArea.select(".domain").remove();

    const focus = chartArea.append("g").style("display", "none");

    focus
    .append("circle")
    .attr("r", 10)
    .attr("fill", "white")
    .attr("transform", `translate(0, -20)`)
    .attr("fill", "rgba(255, 255, 255, 0.2)")
    .attr("stroke-width", 2);

    focus
      .append("circle")
      .attr("r", 5)
      .attr("fill", "white")
      .attr("stroke", "white")
      .attr("transform", `translate(0, -20)`)
      .attr("stroke-width", 2);

    const tooltip = focus
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", -10)
      .style("fill", "white")
      .attr("transform", `translate(0, -20)`)
      .style("font-size", "12px");

    chartArea
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", () => focus.style("display", null))
      .on("mouseout", () => {
        focus.style("display", "none");
        highlightArea.attr("width", 0);
      })
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);

        const closestPoint = originalData2.sessions.reduce((prev, curr) =>
          Math.abs(xOriginal(dayTransform[curr.day]) - mouseX) < Math.abs(xOriginal(dayTransform[prev.day]) - mouseX)
            ? curr
            : prev
        );

        const xPos = xOriginal(dayTransform[closestPoint.day]);
        const yPos = y(closestPoint.sessionLength);

        focus.attr("transform", `translate(${xPos},${yPos})`);
        tooltip.text(`${closestPoint.sessionLength} min`);

        const highlightX = xPos - xOriginal.step() / 2;
        highlightArea.attr("x", highlightX).attr("width", width - highlightX);
      });
  }, []);

  return <div ref={chartRef} width={250} height={250}></div>;
};

export default LineChartWithHover;