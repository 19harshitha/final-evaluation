import React from "react";
import { Link } from "react-router-dom";
import styles from "./container.module.css";
import closeIcon from "../../assets/closeIcon.jpg";

const Container = (props) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>{props.children}</div>
        <Link to="/">
          <img
            className={styles.closeIcon}
            src={closeIcon}
            alt="modal-close-icon"
          />
        </Link>
      </div>
    </div>
  );
};

export default Container;
