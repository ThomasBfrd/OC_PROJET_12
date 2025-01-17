import { useEffect, useRef, useState } from "react";
import { Selection, select } from "d3";
import * as d3 from "d3";
import variables from "/src/assets/styles/variables.module.scss";
import "./Performance.scss";
import {
  KindTransform,
  UserPerformances,
} from "../../../app/core/interfaces/user-performance";

export default function Performances({ user }: { user: UserPerformances }) {
  const ref = useRef<SVGSVGElement | null>(null);
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

    const height = 250;

    if (!selection) {
      setSelection(select(ref.current));
    } else {
      selection.selectAll("*").remove();
      const svg = d3
        .select(ref.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      // Décoration polygones intérieurs
      const numberOfHexagons = 5;
      const hexagonRadius = 80;

      for (let j = 0; j < numberOfHexagons; j++) {
        const currentRadius =
          hexagonRadius - j * (hexagonRadius / numberOfHexagons);
        const hexagonPoints = user.data.map((_, i) => {
          const angle = (i * (2 * Math.PI)) / user.data.length;
          const x = currentRadius * Math.cos(angle - Math.PI / 2);
          const y = currentRadius * Math.sin(angle - Math.PI / 2);
          return { x, y };
        });

        svg
          .append("polygon")
          .attr("points", hexagonPoints.map((p) => `${p.x},${p.y}`).join(" "))
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 1);
      }

      // Polygone intérieur
      const innerPolygonPoints = user.data.map((d, i) => {
        const angle = (i * (2 * Math.PI)) / user.data.length;
        const radius = d.value / 3;
        const x = radius * Math.cos(angle - Math.PI / 2);
        const y = radius * Math.sin(angle - Math.PI / 2);
        return { x, y };
      });

      // Polygone
      svg
        .append("polygon")
        .attr(
          "points",
          innerPolygonPoints.map((p) => `${p.x},${p.y}`).join(" ")
        )
        .attr("fill", variables.red)
        .attr("opacity", 0.8)
        .attr("stroke", "red")
        .attr("z-index", 15)
        .attr("stroke-width", 2);

      // Légendes
      user.data.forEach((d, i) => {
        const angle = (i * (2 * Math.PI)) / user.data.length;
        // Décalage pour le texte
        const radius = 105;
        const x = radius * Math.cos(angle - Math.PI / 2);
        const y = radius * Math.sin(angle - Math.PI / 2);

        svg
          .append("text")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(KindTransform[d.kind])
          .style("font-size", "12px")
          .attr("fill", "white");
      });
    }

    return () => {};
  }, [selection, user, width]);

  return (
    <svg
      ref={ref}
      width={width}
      height={250}
      className="performances-svg"
    ></svg>
  );
}
