import './Card.scss'
import { KeyData } from '../../../app/core/interfaces/user-infos.interface'
import { CardData } from '../../../app/core/interfaces/card-data-interface'

export default function Card({userKeyData}: {userKeyData: KeyData}) {
  const keyDataCards: Array<CardData> = [
    {
      image: "/public/protein-icon.png",
      value: userKeyData.proteinCount,
      text: "Protéines",
    },
    {
      image: "/public/carbs-icon.png",
      value: userKeyData.carbohydrateCount,
      text: "Glucides",
    },
    {
      image: "/public/fat-icon.png",
      value: userKeyData.lipidCount,
      text: "Lipides",
    },
    {
      image: "/public/calories-icon.png",
      value: userKeyData.calorieCount,
      text: "Calories",
    },
  ]
  
  return (
    <>
      {keyDataCards.map((card: CardData) => (
       <div key={card.text} className='card'>
            <img className='card-image' src={card.image} alt={card.text}></img>
            <div className="card-text">
              <span className='card-stats'>{card.value}</span>
              <span className='card-type'>{card.text}</span>
            </div>
        </div> 
      ))}
    </>
  )
}
