import React, { useRef, useState, useEffect } from 'react';
import { select, scaleLinear, line, curveCardinal } from 'd3';
import { Selection } from 'd3-selection';
import { AverageSession, UserAverageSession } from '../../../app/core/interfaces/user-average';

const dayTransform: {[key: number]: string} = {
  1 : 'L',
  2 : 'M',
  3: 'M',
  4: 'J',
  5: 'V',
  6: 'S',
  7: 'D',
}

const AverageSessions = ({user}: {user: UserAverageSession}) => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);
  const [width, setWidth] = useState<number>(window.innerWidth)

  const firstUserValue = user.sessions[0];
  const lastUserValue = user.sessions[user.sessions.length - 1];
  const modifiedUser = {...user};
  modifiedUser.sessions = [firstUserValue, ...user.sessions, lastUserValue]

  function checkWidth(): void {
    return window.innerWidth < 1440 ? setWidth(250) : setWidth(300)
  }
  useEffect(() => {

    const handleResize = () => {
      checkWidth();
    };
  
    window.addEventListener("resize", handleResize);
    checkWidth();

    if (!selection) {
      setSelection(select(chartRef.current));
    } else {
      selection.selectAll("*").remove();
      const svg = selection;
      const height = 250;
      const margin = { top: 40, right: 20, bottom: 40, left: 20 };

      const xScale = scaleLinear()
        .domain([0, modifiedUser.sessions.length - 1])
        .range([0, width]);

      const yScale = scaleLinear()
        .domain([0, 100])
        .range([height - margin.bottom, margin.top]);

      const lineGenerator = line<AverageSession>()
        .x((d, i) => xScale(i))
        .y((d) => yScale(d.sessionLength) - 30)
        .curve(curveCardinal);

      // Supression des enfants du SVG avant son rechargement
      svg.selectAll('*').remove();

      // Background foncé au hover, par défaut hidden
      const overlay = svg
        .append('rect')
        .attr('y', 0)
        .attr('height', height)
        .attr('fill', 'rgba(0, 0, 0, 0.1)')
        .attr('visibility', 'hidden');

      // Courbe
      svg
        .append('path')
        .datum(modifiedUser.sessions)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('opacity', 0.9)
        .attr('d', lineGenerator);

      // Point blanc
      const points = svg
        .selectAll('.point')
        // On exclue les points fictifs (premier et dernier point)
        .data(modifiedUser.sessions.slice(1, -1))
        .enter()
        .append('circle')
        .attr('class', 'point')
        .attr('cx', (d, i) => xScale(i + 1))
        .attr('cy', (d) => yScale(d.sessionLength) - 30)
        .attr('r', 5)
        .attr('fill', 'white')
        .style('visibility', 'hidden');

      // Cercle transparent arrière
      const hoverCircle = svg
        .append('circle')
        .attr('r', 10)
        .attr('fill', 'white')
        .attr('opacity', 0.4)
        .style('visibility', 'hidden');

      // Zone hover
      svg
        .selectAll('.hover-zone')
        .data(modifiedUser.sessions.slice(1, -1))
        .enter()
        .append('rect')
        .attr('class', 'hover-zone')
        .attr('x', (d, i) => (i === 0 ? 0 : xScale(i + 0.5)))
        .attr('y', 0)
        .attr('width', (d, i) => (i === 0 ? xScale(1.5) : xScale(i + 1.5) - xScale(i + 0.5)))
        .attr('height', height)
        .attr('fill', 'transparent')
        .on('mousemove', (event, d) => {
          const [mouseX, mouseY] = [event.offsetX, event.offsetY];
          const i = modifiedUser.sessions.findIndex((point) => point === d);

          overlay
            .attr('x', i === 1 ? 0 : xScale(i))
            .attr('width', i === 1 ? width : width - xScale(i))
            .attr('visibility', 'visible');

          // Si on dépasse l'index 5, on change la position offset du tooltip
          const tooltipOffsetX = i >= 5 ? -90 : 10;

          tooltip
            .attr('x', mouseX + tooltipOffsetX)
            .attr('y', mouseY - 30)
            .style('visibility', 'visible');

          tooltipText
            .attr('x', mouseX + tooltipOffsetX + 10)
            .attr('y', mouseY - 5)
            .text(`${d.sessionLength} min`)
            .style('visibility', 'visible')
            .style('font-weight', 'bold')

          points
            .style('visibility', (point) => (point === d ? 'visible' : 'hidden'));

          hoverCircle
            .attr('cx', xScale(i === 0 ? i+1 : i))
            .attr('cy', yScale(d.sessionLength) - 30)
            .style('visibility', 'visible');
        })
        .on('mouseout', () => {
          tooltip.style('visibility', 'hidden');
          tooltipText.style('visibility', 'hidden');
          overlay.attr('visibility', 'hidden');
          points.style('visibility', 'hidden');
          hoverCircle.style('visibility', 'hidden');
        });

      // Tooltip
      const tooltip = svg
        .append('rect')
        .attr('width', 70)
        .attr('height', 40)
        .attr('fill', 'white')
        .style('visibility', 'hidden')
        .style('pointer-events', 'none');

      const tooltipText = svg
        .append('text')
        .attr('fill', 'black')
        .style('visibility', 'hidden')
        .style('pointer-events', 'none');

      // Titre décomposé
      svg
        .append('text')
        .attr('x', margin.left)
        .attr('y', margin.top - 10)
        .attr('fill', 'white')
        .style('font-size', '16px')
        .style('opacity', 0.9)
        .text('Durée moyenne');

      svg
        .append('text')
        .attr('x', margin.left)
        .attr('y', margin.top + 10)
        .attr('fill', 'white')
        .style('font-size', '16px')
        .style('opacity', 0.9)
        .text('des sessions');

      // Légendes sur l'axe X
      svg
        .selectAll('.x-axis-label')
        // On ignore les points fictifs (premier et dernier point)
        .data(modifiedUser.sessions.slice(1, -1))
        .enter()
        .append('text')
        .attr('class', 'x-axis-label')
        .attr('x', (_, i) => xScale(i + 1))
        .attr('y', height - margin.bottom + 20)
        .attr('fill', 'white')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('opacity', 0.9)
        .text((d) => dayTransform[d.day]);

    }

    return () => {}
  }, [selection, width, user, modifiedUser.sessions]);

  return <svg ref={chartRef} height={250} width={width}></svg>;
};

export default AverageSessions;