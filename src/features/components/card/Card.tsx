import React from 'react'
import './Card.scss'

export default function Card({image, number, text}: {image: string, number: string, text: string}) {
  return (
    <>
       <div className='card'>
            <img className='card-image' src={image} alt={text}></img>
            <div className="card-text">
              <span className='card-stats'>{number}</span>
              <span className='card-type'>{text}</span>
            </div>
        </div> 
    </>
  )
}
