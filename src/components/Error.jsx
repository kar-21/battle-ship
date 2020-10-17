import React from "react";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";

const classes = {
  div: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  h1: {
    margin: "0px",
  },
};

function Error(props) {
  const handleRedirect = () => {
    props.history.push("/");
  };

  return (
    <div style={classes.div}>
      <h1 style={classes.h1}>404 Ship Not found</h1>
      <p>Ship you are searching is not found in the sea. Sorry!</p>
      <Button
        color="primary"
        variant="contained"
        size="large"
        onClick={handleRedirect}
      >
        Back to Home
      </Button>
    </div>
  );
}

export default withRouter(Error);
