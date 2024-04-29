import React, { useState, useEffect } from "react";
import {
  Paper,
  TextField,
  Grid,
  Button,
  Box,
  Snackbar,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = (props) => {
  const authContext = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    isAdmin: false, // Default to false for isAdmin
  });
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleIsAdmin = (event) => {
    const { checked } = event.target;
    setUserData({ ...userData, isAdmin: checked });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:5000/users/register", {
        data: userData,
      });

      if (response) {
        const { token, id, isAdmin } = response.data;
        authContext.login(token, id, isAdmin);
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error.response.data);
      setError(error.response.data.message);
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <React.Fragment>
      <Paper elevation={3} style={{ width: 500 }}>
        <Grid
          container
          direction="column"
          alignContent="center"
          justifyContent="center"
          gap={5}
          style={{ paddingTop: "50px" }}
        >
          <Grid item>
            <TextField
              label="Username"
              variant="outlined"
              type="text"
              name="username"
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="E-mail"
              variant="outlined"
              type="text"
              name="email"
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={userData.isAdmin}
                  onChange={handleIsAdmin}
                />
              }
              label="Admin"
            />
          </Grid>
          <Grid item>
            <Box
              textAlign="center"
              justifyContent="center"
              sx={{ display: "flex", flexDirection: "row", gap: "10px" }}
            >
              <Button variant="contained" onClick={handleRegister}>
                Register
              </Button>
              {Object.keys(props)[0] !== "closeForm" && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={props.showSignup}
                >
                  Login
                </Button>
              )}
            </Box>
          </Grid>
          <Grid item />
        </Grid>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default RegisterForm;
