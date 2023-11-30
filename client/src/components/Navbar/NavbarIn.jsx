import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./navbar.module.css";
import bookmarkIcon from '../../assets/bookmarkIcon.png'
import user from "../../assets/user.webp";
import hamburger from "../../assets/hamburger.png";
import cross from "../../assets/cross.png";

const NavItemsIn = (props) => {
  const [showMenu, setShowMenu] = useState(false);
  const [searchParams] = useSearchParams();
  const isBookmarksActive = searchParams.get("viewbookmarks");

  return (
    <> 
      <Link style={{textDecoration: 'none'}} 
      to="/?viewbookmarks=true">
        <button
          style={{
            border: isBookmarksActive
              ? "3px solid #085cff"
              : "3px solid transparent",
          }}
          className={styles.bookmarkBtn}
        >   
        <img className={styles.book} src={bookmarkIcon} 
        height={"18px"} alt="book"/> 
        Bookmarks
        </button> 
      </Link>
     
      <Link to="/?addstory=true">
        <button className={styles.addStoryBtn}>Add Story</button>
      </Link>
      <img className={styles.user} src={user} alt="user" />
      <img
        className={`${styles.toggleIcon} ${
          showMenu ? styles.cross : styles.hamburger
        }`}
        onClick={() => setShowMenu(!showMenu)}
        src={showMenu ? cross : hamburger}
        alt={showMenu ? "cross" : "hamburger"}
      />
      {showMenu && (
        <div className={styles.menuSection}>
          <p>{localStorage.getItem("username")}</p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              localStorage.removeItem("userId");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default NavItemsIn;
