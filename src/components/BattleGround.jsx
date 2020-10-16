import React, { Suspense } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

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
};

function BattleGround(props) {
  return (
    <>
      <Suspense
        fallback={
          <div style={classes.progress}>
            <CircularProgress />
          </div>
        }
      >
        <h1 style={classes.h1}>Battle Ground</h1>
        <BattleGroundCanvas
          gridArray={props.gridArray}
          userName={props.userName}
        />
      </Suspense>
    </>
  );
}

export default BattleGround;
