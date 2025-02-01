import React, { useEffect, useRef, useState } from "react";
import { Selection, select } from "d3";
import * as d3 from "d3";
import "./Score.scss";

const Score = ({ user }: { user: number }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);
  const [width, setWidth] = useState<number>(window.innerWidth);

  function checkWidth(): void {
    return window.innerWidth < 1440 ? setWidth(250) : setWidth(300);
  }
  useEffect(() => {
    const handleResize = () => {
      checkWidth();
    };

    window.addEventListener("resize", handleResize);
    checkWidth();

    if (!selection) {
      setSelection(select(svgRef.current));
    } else {
      // Suppression des enfants du SVG avant sa recréation
      selection.selectAll("*").remove();

      const svg = select(svgRef.current);
      const height = 250;

      // Configuration du SVG
      svg
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2}) rotate(90)`);
      const radius = 80;

      const arcGenerator = d3
        .arc()
        .innerRadius(radius - 12)
        .outerRadius(radius)
        .cornerRadius(50)
        .startAngle(-Math.PI / 2);

      // Angle de fin
      const endAngle = -Math.PI / 2 - user * 2 * Math.PI;

      const g = selection.select("g");

      // Arriere Plan
      g.append("circle")
        .attr("r", radius)
        .attr("fill", "white")
        .attr("z-index", -2)
        .attr("fill-opacity", 0.5);

      const path = g.selectAll<SVGPathElement, number>("path").data([user]);

      path
        .enter()
        .append("path")
        .merge(path)
        .attr("fill", "#E60000")
        .transition()
        .duration(1000)
        .attrTween("d", function (this: SVGPathElement) {
          const interpolateEndAngle = d3.interpolate(-Math.PI / 2, endAngle);
          return (t: number) => {
            return (
              arcGenerator({
                innerRadius: radius - 20,
                outerRadius: radius,
                startAngle: -Math.PI / 2,
                endAngle: interpolateEndAngle(t),
              }) || ""
            );
          };
        });

      // Ajout du texte au centre du cercle
      g.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("class", "percent")
        .text(`${user * 100}%`);

      // Ajout du texte au centre du cercle 2
      g.append("text")
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .attr("class", "details")
        .attr("text-anchor", "middle")
        .selectAll("tspan")
        .data(["de votre", "objectif"])
        .enter()
        .append("tspan")
        .text((d) => d)
        .attr("x", 0)
        .attr("dy", (d, i) => (i === 0 ? 0 : 20));
    }

    return () => {};
  }, [selection, user, width]);

  return (
    <svg className="score-circle" ref={svgRef} width={250} height={250}></svg>
  );
};

export default Score;
