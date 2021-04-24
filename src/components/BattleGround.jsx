import React, { Suspense, useState, useRef } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import ShipImage from "../assets/images/ships-image.svg";
import RobotIcon from "../assets/icons/amy-dunne.svg";
import AvatarOne from "../assets/icons/avatar-1.svg";
import AvatarTwo from "../assets/icons/avatar-2.svg";
import AvatarThree from "../assets/icons/avatar-3.svg";
import AvatarFour from "../assets/icons/avatar-4.svg";

const BattleGroundCanvas = React.lazy(() =>
  import("./canvas/BattleGroundCanvas")
);

const classes = {
  h1: {
    textAlign: "center",
  },
  progress: {
    display: "flex",
    justifyContent: "center",
  },
  transitionName: {
    display: "flex",
    justifyContent: "space-around",
    fontWeight: "800",
    fontSize: "larger",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "space-around",
  },
  robotIcon: {
    height: "20vh",
  },
  avatar: {
    height: "20vh",
  },
  nameImage: {
    display: "flex",
    flexDirection: "column",
  },
  p: {
    fontSize: "x-large",
    fontWeight: "700",
  },
};

function BattleGround(props) {
  const [hasClickedBattle, setHasClickedBattle] = useState(false);
  const transitionRef = useRef(null);
  let Avatar;

  switch (props.userAvatar) {
    case 1:
      Avatar = AvatarOne;
      break;
    case 2:
      Avatar = AvatarTwo;
      break;
    case 3:
      Avatar = AvatarThree;
      break;
    case 4:
      Avatar = AvatarFour;
      break;
    default:
      Avatar = RobotIcon;
      break;
  }

  const Indoduction = () => {
    setTimeout(() => {
      setHasClickedBattle(true);
    }, 5300);

    setTimeout(() => {
      transitionRef.current.focus();
    }, 5000);

    return (
      <button id="transistion" ref={transitionRef} onClick={() =>setHasClickedBattle(true)} className="transition">
        <div style={classes.iconContainer}>
          <div style={classes.nameImage}>
            <img style={classes.avatar} src={Avatar} alt="computer" />
            <p style={classes.p}>{props.userName}</p>
          </div>
          <div style={classes.nameImage}>
            <img style={classes.robotIcon} src={RobotIcon} alt="computer" />
            <p style={classes.p}>Amy Dunne</p>
          </div>
        </div>
        <div style={classes.transitionName}></div>
        <img src={ShipImage} alt="ship" />
      </button>
    );
  };
  return (
    <>
      <Suspense
        fallback={
          <div style={classes.progress}>
            <CircularProgress />
          </div>
        }
      >
        {hasClickedBattle ? (
          <>
            <h1 style={classes.h1}>Battle Ground</h1>
            <BattleGroundCanvas
              gridArray={props.gridArray}
              userName={props.userName}
            />
          </>
        ) : (
          <Indoduction />
        )}
      </Suspense>
    </>
  );
}

export default BattleGround;
