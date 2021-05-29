import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/NavBar/MyNavBar";
import MoviesInCarousel from "./components/MoviesInCarousel/MoviesInCarousel";
import MovieSearch from "./components/MovieSearch/MovieSearch";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import Footer from "./components/Footer/Footer"
import Credits from "./components/Credits/Credits";
import { fetchTotalPages, searchMovies } from "../src/utils/API";
import Register from "./components/Register/Register";
// import UserContext from "./utils/UserContext";


// import { fetchMovies } from "../src/utils/API";

function App() {
  const [searchMovie, setSearchMovie] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  const [currentPage, setCurrentPage] = useState();
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')) || {
    email: "",
    movies_watched: [],
    watchlist:[],
    isLoggedIn: false
  });

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setSearchMovie(newValue);
  };

  const moreResultsClick = async () => {
    console.log("is this triggering?");
    let p = currentPage;
    let newPage = p + 1;
    setCurrentPage(currentPage + 1);
    const res = await searchMovies(searchMovie, newPage);
    const newSearchRes = searchResults.concat(res);
    setSearchResults(newSearchRes);
  };

  const getSearchResults = async (page) => {
    const res = await searchMovies(searchMovie, page);
    if (res) {
      setSearchResults(res);
    }
  };

  const getTotalPages = async () => {
    const res = await fetchTotalPages(searchMovie);
    setTotalPages(res);
  };

  const saveUserMoviesWatched = (data) => {
    console.log(data);
    setUserData({
      email: data.email,
      movies_watched: data.movies_watched,
      watchlist: data.watchlist,
      isLoggedIn: true
    });
  };

  const handleSumbit = () => {
    window.scrollTo(0, 0);
    setCurrentPage(1);
    getSearchResults(1);
    getTotalPages();
  };

  const saveUserData = (data) => {
    setUserData({
      email: data.user.email,
      movies_watched: data.user.movies_watched,
      watchlist: data.user.watchlist,
      isLoggedIn: true
    });
  }
  
  // const clickMovieRender = (movie) => {
  //   setSingleMovie(movie);
    
  // };

  return (
    // <UserContext.Provider>
      <div>
        <Router>
          <Navbar onChange={handleInputChange} onSubmit={handleSumbit} user={userData} logout={setUserData}/>
          <div>
            <Switch>
              <Route exact path={["/", "/home"]}>
                <MoviesInCarousel />
              </Route>
              <Route exact path={["/login"]}>
                <Login saveUserData={saveUserData}/>
              </Route>
              <Route exact path={["/register"]}>
                <Register />
              </Route>
            <Route exact path={["/moviesearch"]}>
            <MovieSearch
                results={searchResults}
                currentPage={currentPage}
                onClick={moreResultsClick}
                totalPages={totalPages}
                // clickMovieRender={clickMovieRender}
                // addMovie={addMovie}
                user={userData}
                setUserMW={saveUserMoviesWatched}
              />
            </Route>
            <Route exact path={["/profile"]}>
              <Profile user={userData}/>
            </Route>
            <Route exact path={["/credits"]}>
              <Credits />
            </Route>
          </Switch>
          <Footer />
        </div>
       
      </Router>
    </div>
    // </UserContext.Provider>
  );
}

export default App;
