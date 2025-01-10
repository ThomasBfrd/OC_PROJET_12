import { useEffect, useRef, useState } from "react";
import { Selection, select } from "d3";
import * as d3 from "d3";
import variables from "/src/assets/styles/variables.module.scss";
import "./Performance.scss";
import {
  KindTransform,
  UserPerformances,
} from "../../../app/core/interfaces/user-performance";

export default function Performances({user}: {user: UserPerformances}) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);

  useEffect(() => {
    console.log(user);
    
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
        const hexagonPoints = user.data.map((_, i) => {
          const angle = (i * (2 * Math.PI)) / user.data.length; // Calcul de l'angle
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
      const innerPolygonPoints = user.data.map((d, i) => {
        const angle = (i * (2 * Math.PI)) / user.data.length; // Calcul de l'angle
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
      user.data.forEach((d, i) => {
        const angle = (i * (2 * Math.PI)) / user.data.length;
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
  }, [selection, user]);

  return <svg ref={ref} width={250} height={250} className="performances-svg"></svg>;
}
