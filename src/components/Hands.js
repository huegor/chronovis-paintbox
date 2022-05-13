import React, {useMemo, useEffect, useRef} from 'react';
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
  handsFree.plugin.palmPointers.offset = {x: -200, y: -200}
  handsFree.useGesture({
    "name": "horns",
    "algorithm": "fingerpose",
    "models": "hands",
    "confidence": 8,
    "description": [
      [
        "addCurl",
        "Thumb",
        "NoCurl",
        1
      ],
      [
        "addCurl",
        "Thumb",
        "HalfCurl",
        0.16666666666666666
      ],
      [
        "addDirection",
        "Thumb",
        "DiagonalUpRight",
        1
      ],
      [
        "addDirection",
        "Thumb",
        "VerticalUp",
        0.08333333333333333
      ],
      [
        "addDirection",
        "Thumb",
        "DiagonalUpLeft",
        0.6666666666666666
      ],
      [
        "addCurl",
        "Index",
        "NoCurl",
        1
      ],
      [
        "addCurl",
        "Index",
        "HalfCurl",
        0.05
      ],
      [
        "addDirection",
        "Index",
        "DiagonalUpRight",
        0.8181818181818182
      ],
      [
        "addDirection",
        "Index",
        "VerticalUp",
        0.09090909090909091
      ],
      [
        "addDirection",
        "Index",
        "DiagonalUpLeft",
        1
      ],
      [
        "addCurl",
        "Middle",
        "FullCurl",
        1
      ],
      [
        "addDirection",
        "Middle",
        "VerticalUp",
        0.6
      ],
      [
        "addDirection",
        "Middle",
        "HorizontalRight",
        0.1
      ],
      [
        "addDirection",
        "Middle",
        "DiagonalUpRight",
        0.4
      ],
      [
        "addDirection",
        "Middle",
        "DiagonalUpLeft",
        1
      ],
      [
        "addCurl",
        "Ring",
        "FullCurl",
        1
      ],
      [
        "addCurl",
        "Ring",
        "HalfCurl",
        0.05
      ],
      [
        "addDirection",
        "Ring",
        "DiagonalUpRight",
        1
      ],
      [
        "addDirection",
        "Ring",
        "VerticalUp",
        0.5
      ],
      [
        "addDirection",
        "Ring",
        "DiagonalUpLeft",
        0.6
      ],
      [
        "addCurl",
        "Pinky",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Pinky",
        "VerticalUp",
        1
      ],
      [
        "addDirection",
        "Pinky",
        "DiagonalUpLeft",
        0.05
      ],
      [
        "setWeight",
        "Index",
        2
      ],
      [
        "setWeight",
        "Pinky",
        2
      ]
    ],
    "enabled": true
  })

//only runs on component mount & dismount
  useEffect(() => {
    console.log(ref);
    if (ref && ref.current) {
      handsFree.start(()=>{handsFree.pause()}); //initializes loop but pauses it instantly
    }
    // console.log(handsFree.pause);
    //stop webcam on unmount
    return () => handsFree.stop();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    if (!props.enabled){
      handsFree.unpause();
      props.setEnabled(true);
      console.log(handsFree.isLooping);

    } else {
      handsFree.pause()
      console.log(handsFree.isLooping);
      props.setEnabled(false);
    }
  }

  // useEffect(() => {
  //
  // }, []);

  // all the magic happens here
  // if (props.enabled) {
  //   // Maps handsfree pincher events to
  //   const eventMap =  {
  //     start: 'mousedown',
  //     held: 'mousemove',
  //     released: 'mouseup'
  //   }
  //   handsFree.use("gestureClick", (data) => {
  //     if (!data.hands || !data.hands.pointer || !data.hands.pinchState) return;
  //     // if (!data.hands.pointer[0].isVisible) return;
  //     // // console.log(e.hands.pointer[0].isVisible? e.hands.pointer[0] : null);
  //     // if (data.hands.gesture[0] && data.hands.gesture[0]["name"] === "horns") { //on "horns," mouse click at LH palm pointer
  //     //   console.log(data.hands);
  //     //   // console.log(data.hands.pointer[0].x, data.hands.pointer[0].y);
  //     //   // on event, create a new mouseclick event at position of left palm
  //     //   new MouseEvent("click", {clientX: data.hands.pointer[0].x, clientY: data.hands.pointer[0].y});
  //     // }
  //
  //     const hands = data.hands;
  //
  //     hands.multiHandLandmarks.forEach((landmarks, n) => {
  //       const pointer = hands.pointer[n] //x, y, isVisible
  //       const pinchState = hands.pinchState[n]?hands.pinchState[n][0]:''; //start, held, released
  //       // const curPinch = hands.curPinch[n]?hands.curPinch[n][0]:{x:0, y:0}; //x, y
  //       // const origPinch = hands.origPinch[n]?hands.origPinch[n][0]:{x:0, y:0} //x, y
  //
  //       if (pointer.isVisible && pinchState) {
  //         const mappedState = eventMap[pinchState];
  //         const $el = document.elementFromPoint(pointer.x, pointer.y)
  //         // console.log(pointer.x, pointer.y, adjustedY)
  //         // console.log(mappedState, pointer.x, pointer.y)
  //         console.log($el, $el.click)
  //         if ($el && $el.click) {
  //           $el.click()
  //         }
  //       }
  //
  //     })
  //   })
  // }

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
      [
    {
        "name": "horns",
        "confidence": 8.083333333333334,
        "pose": [
            [
                "Thumb",
                "No Curl",
                "Diagonal Up Left"
            ],
            [
                "Index",
                "No Curl",
                "Diagonal Up Left"
            ],
            [
                "Middle",
                "Half Curl",
                "Diagonal Up Left"
            ],
            [
                "Ring",
                "Half Curl",
                "Diagonal Up Left"
            ],
            [
                "Pinky",
                "No Curl",
                "Vertical Up"
            ]
        ]
    },
    {
        "name": "",
        "confidence": 0,
        "pose": [
            [
                "Thumb",
                "Half Curl",
                "Horizontal Left"
            ],
            [
                "Index",
                "Half Curl",
                "Diagonal Up Left"
            ],
            [
                "Middle",
                "Half Curl",
                "Diagonal Down Left"
            ],
            [
                "Ring",
                "Half Curl",
                "Diagonal Down Right"
            ],
            [
                "Pinky",
                "Half Curl",
                "Vertical Down"
            ]
        ]
    },
    null,
    null
]
      - on horns, new MouseEvent
    - add "pause" plugin
      - on fist, pause/stop handsFree

      {props.enabled &&
        <div>
        </div>
      }
  */


  return (
    <div ref={ref}>
      {/*<HandsButton handleClick={handleClick} />*/}
      <button onClick={handleClick}>
        {props.enabled?"disable hands":"enable hands"}
      </button>
    </div>
  )
};

export default Hands;
