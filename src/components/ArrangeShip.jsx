import React, { Suspense } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const ArrangeShipCanvas = React.lazy(() =>
  import("./canvas/ArrangeShipCanvas")
);

const classes = {
  h1: {
    textAlign: "center",
    height: "7%",
  },
  h3: {
    padding: "0",
  },
  arrange: {
    paddingTop: "5vh",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  progress: {
    display: "flex",
    justifyContent: "center",
  },
};

function ArrangeShips(props) {
  return (
    <>
      <h1 style={classes.h1}>Arrange Your Ships {props.userName} </h1>
      <Suspense
        fallback={
          <div style={classes.progress}>
            <CircularProgress />
          </div>
        }
      >
        <ArrangeShipCanvas getGridArray={props.getGridArray} />
      </Suspense>
    </>
  );
}
export default ArrangeShips;
