import React, { useEffect, useRef, useState } from "react";
import { Selection } from "d3";
import * as d3 from "d3";
import variables from "/src/assets/styles/variables.module.scss";
import "./Score.scss";

const Score = ({user}: {user: number}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);

  useEffect(() => {
    if (!selection) {
      const svg = d3.select(svgRef.current);
      const width = 250;
      const height = 250;

      // Configuration de la zone SVG
      svg
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2}) rotate(90)`);

      setSelection(svg);
    } else {
      const radius = 80;

      // Générateur d'arc
      const arcGenerator = d3
        .arc()
        .innerRadius(radius - 12)
        .outerRadius(radius)
        .cornerRadius(50)
        .startAngle(-Math.PI / 2);

      // Angle de fin basé sur la valeur 64%
      const endAngle = -Math.PI / 2 - (64 / 100) * 2 * Math.PI;

      // Sélection du groupe (ou création si nécessaire)
      const g = selection.select("g");

      // Arriere Plan
      g.append("circle")
        .attr("r", radius) // Rayon du cercle
        .attr("fill", "white") // Couleur du fond
        .attr("z-index", -2)
        .attr("fill-opacity", 0.5); // Opacité pour le fond intérieur

      const path = g.selectAll<SVGPathElement, number>("path").data([user]);
      path
        .enter()
        .append("path")
        .merge(path) // Fusionne les entrées et les mises à jour
        .attr("fill", variables.red)
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

      // Ajout du texte au centre de l'arc
      g.append("text")
        .attr("x", 0) // Position X au centre
        .attr("y", -10) // Position Y au centre
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle") // Centrer le texte
        .attr("font-size", "16px") // Taille de la police
        .attr("class", "percent")
        .text(`${user*100}%`);

      // Ajout du texte au centre de l'arc
      g.append("text")
        .attr("y", 15) // Position Y au centre
        .attr("transform", "rotate(-90)")
        .attr("class", "details")
        .attr("text-anchor", "middle") // Centrer le texte
        .selectAll("tspan") // Sélectionne tous les tspans
        .data(["de votre", "objectif"]) // Données pour les lignes
        .enter() // Crée un tspan pour chaque ligne
        .append("tspan") // Ajoute un tspan
        .text((d) => d) // Définit le texte du tspan
        .attr("x", 0) // Position X au centre
        .attr("dy", (d, i) => (i === 0 ? 0 : 20)); // Position Y pour le retour à la ligne
    }
  }, [selection]);

  return (
    <svg className="score-circle" ref={svgRef} width={250} height={250}></svg>
  );
};

export default Score;
