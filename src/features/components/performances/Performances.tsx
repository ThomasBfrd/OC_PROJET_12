import { useEffect, useRef, useState } from "react";
import { Selection, select } from "d3";
import * as d3 from "d3";
import variables from "/src/assets/styles/variables.module.scss";
import "./Performance.scss";
import {
  KindTransform,
  UserPerformances,
} from "../../../app/core/interfaces/user-performance";

const data2: UserPerformances = {
  userId: 12,
  kind: {
    1: "cardio",
    2: "energy",
    3: "endurance",
    4: "strength",
    5: "speed",
    6: "intensity",
  },
  data: [
    { value: 80, kind: 1 },
    { value: 120, kind: 2 },
    { value: 140, kind: 3 },
    { value: 50, kind: 4 },
    { value: 200, kind: 5 },
    { value: 90, kind: 6 },
  ],
};

export default function Performances() {
  const ref = useRef<SVGSVGElement | null>(null);
  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);

  useEffect(() => {
    const width = 250;
    const height = 250;
    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`); // Centre le graphique

    if (!selection) {
      setSelection(select(ref.current));
    } else {
// Ajout d'hexagones intérieurs
      const numberOfHexagons = 5; // Nombre d'hexagones à dessiner
      const hexagonRadius = 80; // Rayon de l'hexagone principal
      
      for (let j = 0; j < numberOfHexagons; j++) {
        const currentRadius =
        hexagonRadius - j * (hexagonRadius / numberOfHexagons); // Rayon réduit
        const hexagonPoints = data2.data.map((_, i) => {
          const angle = (i * (2 * Math.PI)) / data2.data.length; // Calcul de l'angle
          const x = currentRadius * Math.cos(angle - Math.PI / 2); // Coordonnée X
          const y = currentRadius * Math.sin(angle - Math.PI / 2); // Coordonnée Y
          return { x, y };
        });

        svg
        .append("polygon")
        .attr("points", hexagonPoints.map((p) => `${p.x},${p.y}`).join(" "))
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 1);
        }

              // Calculer les points pour le polygone intérieur basé sur les valeurs des métriques
      const innerPolygonPoints = data2.data.map((d, i) => {
        const angle = (i * (2 * Math.PI)) / data2.data.length; // Calcul de l'angle
        const radius = d.value / 3; // Normaliser la valeur pour le rayon
        const x = radius * Math.cos(angle - Math.PI / 2); // Coordonnée X
        const y = radius * Math.sin(angle - Math.PI / 2); // Coordonnée Y
        return { x, y };
      });

        // Dessiner le polygone intérieur
        svg
          .append("polygon")
          .attr(
            "points",
            innerPolygonPoints.map((p) => `${p.x},${p.y}`).join(" ")
          )
          .attr("fill", variables.red) // Couleur avec transparence
          .attr("opacity", 0.8)
          .attr("stroke", "red")
          .attr("z-index", 15)
          .attr("stroke-width", 2);

      // Ajout des labels pour chaque métrique
      data2.data.forEach((d, i) => {
        const angle = (i * (2 * Math.PI)) / data2.data.length;
        const radius = 105; // Décalage pour le texte
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
          .attr("fill", "white")
      });
    }
  }, [selection]);

  return <svg ref={ref} width={250} height={250} className="performances-svg"></svg>;
}
