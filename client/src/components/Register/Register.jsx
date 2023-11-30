import React, { useState } from "react";
import Container from "../Container/Container";
import styles from "./register.module.css";
import pwdIcon from "../../assets/pwdIcon.png";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowError(false);
       
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
   
      const responseData = await response.json();
      window.localStorage.setItem("token", responseData.token);
      window.localStorage.setItem("userId", responseData.userId);
      window.localStorage.setItem("username", responseData.username);
      

      setTimeout(() => {
        navigate ("/?signin=true");
      }, 1200);
    
      
    } catch (error) {
      setShowError(true);
      setErrorMessage(error.message);
      console.log(error);
    } 
  };

  return (
    <>
      <Container>
        
          <>
            <h1 className={styles.formHeader}>Register to SwipTory</h1>
            <form className={styles.formContainer}>
              <div>
                <label> Username</label>
                <input
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  type="text"
                  placeholder="Enter username"
                />
              </div>
              <div className={styles.passwordContainer}>
                <label>Password</label>
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className={styles.passwordInput}
                />
                <img
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordIcon}
                  src={pwdIcon}
                  alt="password icon"
                />
              </div>
              {showError && <div className={styles.error}>{errorMessage}</div>}
              <div>
                <button onClick={handleSubmit}>Register</button>

              </div>
             
            </form>
          </>
        
      </Container>
    </>
  );
};

export default Register;
