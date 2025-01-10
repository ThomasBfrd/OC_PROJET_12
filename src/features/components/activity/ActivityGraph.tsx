import { scaleBand, scaleLinear, select, Selection } from "d3";
import { useEffect, useRef, useState } from "react";
import "./ActivityGraph.scss";
import variables from '/src/assets/styles/variables.module.scss';
import { UserActivity } from "../../../app/core/interfaces/user-activity";

const legends = [
  { color: variables.darkgrey, text: "Poids (kg)" },
  { color: variables.red, text: "Calories brûlées (kCal)" },
];

export default function ActivityGraph({user}: {user: UserActivity | null}) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null);
  const [width, setWidth] = useState<number>(document.body.clientWidth)

  const kg = user?.sessions.map((element) => element.kilogram) || [];
  const minKg = Math.min(...kg) - 3;
  const maxKg = Math.max(...kg) + 3;
  const calories = user?.sessions.map((element) => element.calories) || [];
  const maxCalories = Math.max(...calories) + 30;

  function checkWidth()  {

    return window.innerWidth > 1440 ? setWidth(650) : setWidth(750);
  };

  useEffect(() => {
    console.log(user);
    
    // const svgWidth = 600;
    const svgWidth = width;
    const svgHeight = 200;
    const barWidth = 15;
    const padding = 10;

    const handleResize = () => {
      checkWidth();
    };
  
    window.addEventListener("resize", handleResize);
    checkWidth();

    // Etendue des valeurs sur l'axe X
    const xScale = scaleBand()
      .domain(user?.sessions.map((_, i) => `${i + 1}`) as string[] || [])
      .range([0, svgWidth])
      .align(0.5)
      .padding(1);

    // Etendue des valeurs sur l'axe Y pour les données Kg
    const yScaleKilogram = scaleLinear()
      .domain([minKg, maxKg])
      .range([svgHeight, 0]);

    // Etendue des valeurs sur l'axe Y pour les données kCal
    const yScaleCalories = scaleLinear()
      .domain([0, maxCalories])
      .range([svgHeight, 0]);
      
      // Généralisation des repères horizontaux en pointillés, déterminant leur position en calculant la médiane des valeurs reçues
      const tickValuesKg = [minKg, (minKg + maxKg) / 2, maxKg];
      
    if (!selection) {
      setSelection(select(ref.current));
    } else {

      // REPERE HORIZONTAUX
      selection
        .selectAll("line.grid")
        .data(tickValuesKg)
        .join("line")
        .attr("class", "grid")
        .attr("x1", "0")
        .attr("x2", svgWidth - padding)
        .attr("y1", (d) => yScaleKilogram(d))
        .attr("y2", (d) => yScaleKilogram(d))
        .attr("stroke", variables.lightgrey)
        .attr("stroke-dasharray", "5,5");

      // TOOLTIP
      // Création du tooltip dans le DOM
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      document.body.appendChild(tooltip);

      // GROUPBAR : Création des barres
      const barGroups = selection
        .selectAll("g.bar-group")
        .data(user?.sessions || [])
        .join("g")
        .attr("class", "bar-group")
        .attr("transform", (_, i) => `translate(${xScale(`${i + 1}`)!}, 0)`)
        // Hover sur les rectangles liés aux groupes, permettant de changer le background
        .on("mouseenter", function () {
          select(this)
            .select("rect.background")
            .attr("fill", "rgba(0, 0, 0, 0.2)");
        })
        .on("mouseleave", function () {
          select(this)
            .select("rect.background")
            .attr("fill", "transparent");
        })
        // Ajout des rectangles pour le background
        .call((g) => {
          // console.log("ajout des rectangles background");
          g.selectAll("rect.background")
            .data([null])
            .join("rect")
            .attr("class", "background")
            .attr("x", -40)
            .attr("y", 0)
            .attr("width", 75)
            .attr("height", svgHeight)
            .attr("fill", "transparent");

          // Création des barres pour représenter les données Kg
         g.selectAll("g.kilogram")
         .data((d) => [d.kilogram])
         .join("g")
         .attr("class", "kilogram")
         .attr("transform", `translate(-20, 0)`)
         .call((g) => {
           g.append("rect")
             .attr("x", 0)
             .attr("y", (d) => yScaleKilogram(d))
             .attr("width", 10)
             .attr("height", (d) => svgHeight - yScaleKilogram(d))
             .attr("fill", variables.darkgrey);
            g.append("path")
             .attr("d", (d) => `
               M 0 ${yScaleKilogram(d)} 
               Q 5 ${yScaleKilogram(d) - 5} 10 ${yScaleKilogram(d)} 
               L 10 ${yScaleKilogram(d) + (svgHeight - yScaleKilogram(d))} 
               L 0 ${yScaleKilogram(d) + (svgHeight - yScaleKilogram(d))} 
               Z
             `)
             .attr("fill", variables.darkgrey);
         });
        // Création des barres pour représenter les données kCal
       g.selectAll("g.calories")
         .data((d) => [d.calories])
         .join("g")
         .attr("class", "calories")
         .attr("transform", `translate(${barWidth / 2}, 0)`)
         .call((g) => {
           g.append("rect")
             .attr("x", 0)
             .attr("y", (d) => yScaleCalories(d))
             .attr("width", 10)
             .attr("height", (d) => svgHeight - yScaleCalories(d))
             .attr("fill", variables.red);
            g.append("path")
             .attr("d", (d) => `
               M 0 ${yScaleCalories(d)} 
               Q 5 ${yScaleCalories(d) - 5} 10 ${yScaleCalories(d)} 
               L 10 ${yScaleCalories(d) + (svgHeight - yScaleCalories(d))} 
               L 0 ${yScaleCalories(d) + (svgHeight - yScaleCalories(d))} 
               Z
             `)
             .attr("fill", variables.red);
         });
        });

      // Hover permettant l'affichage du tooltip affichant les données liées au groupe ciblé
      barGroups
        .on("mouseover", function (_, d) {
          tooltip.style.visibility = "visible";
          tooltip.innerHTML = `
    <div class="tooltip-content">
      <span>${d.kilogram}kg</span>
      <span>${d.calories}kCal</span>
    </div>
    `;
        })
        .on("mouseout", function () {
          tooltip.style.visibility = "hidden";
        })
        // Position dynamique du tooltip
        .on("mousemove", function (event) {
          tooltip.style.top = event.pageY - 90 + "px";
          tooltip.style.left = event.pageX + 15 + "px";
        });

      // Titre du graphique
      selection
        .selectAll("text.title")
        .data([null])
        .join("text")
        .attr("x", 15)
        .attr("y", -50)
        .attr("font-size", "16px")
        .attr("font-weight", "600")
        .text("Activité quotidienne");

      // Axe X avec ses légendes
      selection
        .selectAll("text.x-axis")
        .data(user?.sessions.map((_, i) => `${i + 1}`) || [])
        .join("text")
        .attr("class", "x-axis")
        .attr("x", (d) => xScale(d)! + xScale.bandwidth() / 2)
        .attr("y", svgHeight + 25)
        .attr("text-anchor", "middle")
        .attr("font-weight", "800")
        .attr("fill", "grey")
        .attr("font-size", "12px")
        .text((d) => d);

      // Axe Y avec ses légendes
      selection
        .selectAll("text.y-axis")
        .data(tickValuesKg)
        .join("text")
        .attr("class", "y-axis")
        .attr("x", () => svgWidth + 10)
        .attr("y", (d) => yScaleKilogram(d) + 4)
        .attr("text-anchor", "middle")
        .attr("font-weight", "800")
        .attr("fill", "grey")
        .attr("font-size", "12px")
        .text((d) => d);

      // Légendes générales
      selection
        .selectAll("g.legend")
        .data(legends)
        .join("g")
        .attr("class", "legend")
        .attr("transform", (_, i) => `translate(${i * 100 + 350}, -50)`)

        // Création de des légendes selon les data legends injectées
        .call((g) => {
          g.append("circle")
            .attr("cx", 0)
            .attr("cy", -5)
            .attr("r", 5)
            .attr("fill", (d) => d.color);

          g.append("text")
            .attr("x", 10)
            .attr("y", 0)
            .attr("font-size", "12px")
            .text((d) => d.text);
        });
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [selection, width, user]);
  return (
    <div className="bars-chart" style={{ paddingTop: "100px" }}>
      {/* Création du SVG avec ses dimensions permettant son affichage dans le DOM */}
      <svg
        ref={ref}
        width={window.innerWidth > 1440 ? 700 : 800}
        height={250}
        style={{ overflow: "visible" }}
      ></svg>
    </div>
  );
}
