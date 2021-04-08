import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./OwnCardEdit.module.css";
import axios from "axios";
import Loader from "../Loader/Loader";
import SpeechLoader from "../Loader/SpeechLoader";
const OwnCardEdit = (props) => {
  const history = useHistory();
  const imgUrl = props.imgUrl;
  const [cardName, setCardName] = useState(props["cardName"]);
  let [lenCardName, setlenCardName] = useState(props["cardName"].length);
  const cardId = props.cardId;
  const [isLoading, setLoading] = useState(false);
  const [speechLoading, setSpeechLoading] = useState(false);
  const voiceUrl = props.voiceUrl;
  const special_pattern = /[`~!@#$%^&*,|\\\'\";:\/]/gi;
  const special_pattern2 = /([^가-힣0-9a-zA-Z?\x20])/i;

  let audio = "";

  const onInputChange = (e) => {
    if (e.target.value.length > 10) {
      alert("카드이름은 10자까지 가능합니다.");
    } else {
      setCardName(e.target.value);
      setlenCardName(e.target.value.length);
    }
  };
  const editCard = () => {
    if (special_pattern.test(cardName)) {
      alert("?와 . 를 제외한 특수문자는 사용할 수 없습니다.");
    } else if (special_pattern2.test(cardName)) {
      alert("자음 또는 모음만 있는 문장은 사용할 수 없습니다.");
    } else if (
      !special_pattern.test(cardName) &&
      !special_pattern2.test(cardName)
    ) {
      setLoading(!isLoading);
      const token = sessionStorage.getItem("jwt");
      const data = {
        word: cardName,
      };
      axios
        .put(process.env.REACT_APP_API_URL + `/card/${cardId}`, data, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          setLoading(!isLoading);
          history.go(0);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const speakClick = () => {
    setSpeechLoading(!speechLoading);
    const token = sessionStorage.getItem("jwt");
    let data = {
      word: cardName,
    };
    axios
      .post(process.env.REACT_APP_API_URL + `/voice`, data, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        axios
          .get(process.env.REACT_APP_API_URL + `/voice/${cardName}`, {
            headers: {
              Authorization: token,
            },
          })
          .then((res) => {
            setSpeechLoading(false);
            audio = new Audio(process.env.REACT_APP_IMG_PATH + res.data);
            audio.load();
            playAudio();
          })
          .catch((err) => {
            alert("미리듣기 오류입니다.. 다음에 시도해주세요");
            setSpeechLoading(false);
          });
      })
      .catch((err) => {
        alert("미리듣기 오류입니다.. 다음에 시도해주세요");
        setSpeechLoading(false);
      });
  };
  const playAudio = () => {
    const audioPromise = audio.play();
    if (audioPromise !== undefined) {
      audioPromise
        .then((_) => {
          setSpeechLoading(false);
        })
        .catch((err) => {
          alert("미리듣기 오류입니다.. 다음에 시도해주세요");
          setSpeechLoading(false);
        });
    }
  };
  return (
    <>
      {(() => {
        if (isLoading !== false) return <Loader></Loader>;
        else if (isLoading === false)
          return (
            <>
              {speechLoading ? <SpeechLoader></SpeechLoader> : ""}
              <div className={styles.edit_box}>
                <div className={styles.image_box}>
                  <img src={imgUrl} alt="이미지를 등록해주세요" />
                </div>
                <div className={styles.card_input_box}>
                  <input
                    type="text"
                    className={styles.card_input}
                    defaultValue={cardName}
                    onChange={onInputChange}
                    placeholder="카드 이름"
                    maxLength="10"
                  />
                  <img
                    onClick={speakClick}
                    src="/images/speaker-filled-audio-tool.svg"
                    alt="대체이미지"
                  />
                </div>
                <div className={styles.count_Name}>{lenCardName}/10</div>
              </div>

              <div className={styles.bottom_button}>
                <div className={styles.button_box}>
                  <button
                    className={styles.close_button}
                    onClick={props.goEditStateChange}
                  >
                    취소
                  </button>
                  <button className={styles.edit_button} onClick={editCard}>
                    등록
                  </button>
                </div>
              </div>
            </>
          );
      })()}
    </>
  );
};

export default OwnCardEdit;
