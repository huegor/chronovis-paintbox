import React, {useMemo, useEffect, useRef, useCallback} from 'react';
import HandsFree from 'handsfree';
// import EventDispatcher from 'react-event-dispatcher';
// import hands from '@mediapipe/hands';

//https://handsfree.js.org
//IMPORTANT: handsfree.js source code has been edited to turn pinchScroll into clicker


function Hands(props) {
  //init
  const ref = useRef(); //creates reference for *this* render
  //only re-renders on new ref. without useRef and useMemo, a new handsFree gets created on every render
  const handsFree = useMemo(() =>
    new HandsFree({
      hands:{
        enabled: true,
        maxNumHands: 1
      }
    }), [ref]);
  handsFree.enablePlugins('browser');
  //handsFree.plugin.palmPointers.offset = {x: -200, y: -200}

//only runs on component mount & dismount
  useEffect(() => {
    if (ref && ref.current) {
      handsFree.start(()=>{handsFree.pause()}); //initializes loop but pauses it instantly
    }
    // console.log(handsFree.pause);
    //stop webcam on unmount
    return () => handsFree.stop();
  }, []);

  // const handleClick = (e) => {
  //   e.preventDefault();
  //   if (!props.enabled){
  //     handsFree.unpause();
  //     props.setEnabled(true);
  //     console.log(handsFree.isLooping);
  //
  //   } else {
  //     handsFree.pause()
  //     console.log(handsFree.isLooping);
  //     props.setEnabled(false);
  //   }
  // }

  const KeyDetector = (props) => {
    const keyPress = useCallback((event) => {
      console.log(event)
      if (event.code === 'AltLeft') {
        if (!handsFree.isLooping){
          handsFree.unpause();
          // props.setEnabled(true);
        } else {
          handsFree.pause()
          // props.setEnabled(false);
        }
      }
    }, []);

    //unsubscribe to avoid memory leaks
    useEffect(() => {
      document.addEventListener("keydown", keyPress, true);

      return () => {
        document.removeEventListener("keydown", keyPress, true);
      };
    }, []);

    return (
      <input className="debugging"/>
    )
  };
  /*

  - disable pinch scroll
  - if thumb and index pinched on any hand, dispatch click event

  pinch start:
  - create click event starting w current point
  - elementFromPoint(curPinch[1][0].x, curPinch[1][0].y)

  pinch held:
  - create mouse move events

  pinch released:
  - create mouse up event

  data.hands.pinchState[0][0] -> gets state of LH index finger
  can be either "start", "held", "released"
  handsFree.on(handsfree-finger-pinched-start-0)
  handsFree.on(handsfree-finger-pinched-held-0)
  handsFree.on(handsfree-finger-pinched-released-0)


  */


  /*
    TODO:
    - draw palm Positions
      - shrink for click
      - something for drag (oblong?)
    - add "click" plugin
      - create plugin for "horns" hand gesture
      - on horns, new MouseEvent
    - add "pause" plugin
      - on fist, pause/stop handsFree

  */


  return (
    <div ref={ref}>
      {/*
      <button onClick={handleClick}>
        {props.enabled?"disable hands":"enable hands"}
      </button>
      */}
      <KeyDetector/>
    </div>
  )
};

export default Hands;
