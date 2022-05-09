import React, {useMemo, useEffect, useRef} from 'react';
import HandsFree from 'handsfree';
// import hands from '@mediapipe/hands';

//https://handsfree.js.org

function initHandsFree() {
  //

}

function Hands(props) {
  //init
  const ref = useRef(); //creates reference for *this* render
  //only re-renders on new ref. without useRef and useMemo, a new handsFree gets created on every render
  const handsFree = useMemo(() =>
    new HandsFree({
      hands:{
        enabled: true,
        maxNumHands: 2
      }
    }), [ref]);
  handsFree.enablePlugins('browser');
  // handsFree.plugin.palmPointers.enable()
  // handsFree.plugin.palmPointers.speed = {x: 2, y: 2}
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

      handsFree.start(()=>{handsFree.pause()}); //initializes loop but pauses it instantly'
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

  // all the magic happens here
  if (props.enabled) {
    handsFree.on('data', (e) => {
      //e can either
      if (!e.hands) return;
      if (!e.hands.pointer[0].isVisible) return;
      // console.log(e.hands.pointer[0].isVisible? e.hands.pointer[0] : null);
      if (e.hands.gesture[0] && e.hands.gesture[0]["name"] === "horns") { //on "horns," mouse click at LH palm pointer
        console.log(e.hands.pointer[0].x, e.hands.pointer[0].y);
        // on event, create a new mouseclick event at position of left palm
        new MouseEvent("click", {clientX: e.hands.pointer[0].x, clientY: e.hands.pointer[0].y});
      }
    });
  }

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
