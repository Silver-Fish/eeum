import React from 'react';
import { useState } from 'react';
import styles from './Card.module.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
  
const Card = (props) => {
  const history = useHistory();
  const isCardStateEdit = useState(false)[0]
  const isEdit = props.isEdit
  const textValue = props.textValue 
  const cardUrl = process.env.REACT_APP_IMG_PATH + props.cardUrl
  const voiceUrl = process.env.REACT_APP_IMG_PATH+props.voiceUrl
  const voiceLength = props.voiceLength
  const cardId = props.id
  console.log(cardUrl)
  let audio = ""

  const cardButtonClick = (e) => {    
    props.cardClick({
      cardName: {textValue}, 
      cardUrl: {cardUrl},
      voiceUrl: {voiceUrl},
      voiceLength:{voiceLength}
    })
    audio = new Audio(voiceUrl)
    audio.load()
    playAudio()   
  }
  const playAudio = () => {
    const audioPromise = audio.play()
    if (audioPromise !== undefined) {
      audioPromise
        .then(_ => {
          // autoplay started
        })
        .catch(err => {
          // catch dom exception
          console.info(err)
        })
    }
  }


  
  const CardDeleteClick = (e) => {    
    e.stopPropagation();
    const token = sessionStorage.getItem('jwt')   
    axios.delete(process.env.REACT_APP_API_URL + '/card/'+ cardId, {
      headers: {
        'Authorization': token
        }
    })
    .then(()=> {
      history.go(0)
    })
    .catch((err) => {
      console.log(err)
    })
  }  

  const CardEditClick = (e) => {
    
    props.CardStateEdit({state:!isCardStateEdit, url:cardUrl, name: textValue, cardId: cardId})
  }


  return(
    <>
    { isEdit === false
      ?
    <button className={styles.card} onClick={cardButtonClick}>
      <img className={styles.card_image} src={cardUrl} alt="qr 카드"/>
        {textValue}
    </button>
    : 
    <>       
      <button className={styles.card_is_edit} onClick={CardEditClick}>
        <div className={styles.card_del_box} >
          <img src="/images/minus.png" alt="" onClick={CardDeleteClick}/>
        </div>
        <img className={styles.card_image} src={cardUrl} alt="qr 카드"/>
          {textValue}
      </button>
    </>

      }
    </>
  )
}

export default Card;