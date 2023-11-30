import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import FilterSet from '../components/Filter/FilterSet'
import Category from "../components/Category/Category";
import Register from "../components/Register/Register";
import SignIn from "../components/SignIn/SignIn";
import AddStory from "../components/AddStory/AddStory";
import MobileStory from "../components/MobileAddStory/MobileStory";
import StoryViewer from "../components/StoryViewer/StoryViewer";
import Slide from "../components/Slide/Slide";
import filters from "../content/data";
import YourStories from "../components/YourStories/YourStories";
import Book from "../components/Bookmarks/Book";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const displayParamMappings = {
    register: queryParams.get("register"),
    signin: queryParams.get("signin"),
    addstory: queryParams.get("addstory"),
    editstory: queryParams.get("editstory"),
    viewstory: queryParams.get("viewstory"),
    viewbookmarks: queryParams.get("viewbookmarks"),
    yourstories: queryParams.get("yourstories"),
    slide: queryParams.get("slide"),
  };

  const [authValidated, setAuthValidated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(["All"]);
  const [story, setStory] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const validateToken = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/validate`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          setAuthValidated(true);
        } else {
          setAuthValidated(false);
        }
      } catch (error) {
        console.error("Token validation error:", error);
      }
    };

    validateToken();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [displayParamMappings.signin]);

  const handleSelectFilters = (filter) => {
    if (filter === "All") {
      setSelectedFilters(["All"]);
    } else {
      const updatedFilters = selectedFilters.includes("All")
        ? [filter]
        : selectedFilters.includes(filter)
        ? selectedFilters.filter((f) => f !== filter)
        : [...selectedFilters, filter];
      if (updatedFilters.length === 0) updatedFilters.push("All");
      setSelectedFilters(updatedFilters);
    }
  };

  const handleStoryViewer = (story) => {
    setStory(story);
    navigate("/?viewstory=true");
  };

  const renderCategories = () => {
    if (displayParamMappings.viewbookmarks) {
      return <Book handleStoryViewer={handleStoryViewer} />;
    } else if (displayParamMappings.yourstories) {
      return (
        <YourStories
          selectedFilters={selectedFilters}
          handleStoryViewer={handleStoryViewer}
        />
      );
    } else {
      return (
        <>
          <FilterSet
            selectedFilters={selectedFilters}
            handleSelectFilters={handleSelectFilters}
          />
          {!isMobile && (
            <YourStories
              selectedFilters={selectedFilters}
              handleStoryViewer={handleStoryViewer}
            />
          )}

          {selectedFilters.includes("All")
            ? filters
                .filter((filter) => filter.name !== "All")
                .map((filter) => (
                  <Category
                    key={filter.name}
                    category={filter.name}
                    handleStoryViewer={handleStoryViewer}
                  />
                ))
            : selectedFilters.map((filter) => (
                <Category
                  key={filter}
                  category={filter}
                  authValidated={authValidated}
                  handleStoryViewer={handleStoryViewer}
                />
              ))}
        </>
      );
    }
  };

  return (
    <>
      <Navbar authValidated={authValidated} />
      {renderCategories()}

      {displayParamMappings.register && <Register />}
      {displayParamMappings.signin && <SignIn />}

      {displayParamMappings.addstory &&
        (isMobile ? <MobileStory /> : <AddStory />)}
      {displayParamMappings.editstory &&
        (isMobile ? <MobileStory /> : <AddStory />)}
      {displayParamMappings.viewstory && (
        <StoryViewer slides={story} isMobile={isMobile} />
      )}

      {displayParamMappings.slide && <Slide />}
    </>
  );
};

export default Home;
