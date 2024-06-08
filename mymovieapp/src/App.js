// src/App.js
import React, { Component } from 'react';
import './App.css';

class MovieApp extends Component {
  state = {
    movies: [],
    pageNo: 1,
    activePage: 'Popular',
    totalPages: 0,
    searchQuery: ''
  };

  componentDidMount() {
    this.fetchMovies();
  }

  fetchMovies = () => {
    const { activePage, pageNo } = this.state;
    const urls = {
      Popular: 'getPopularMoviesURL',
      'Top Rated': 'topRatedMoviesURL',
      Upcoming: 'upcomingMoviesURL'
    };

    fetch(`${urls[activePage]}?page=${pageNo}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          movies: data.results,
          totalPages: data.total_pages
        });
      });
  };

  handlePageChange = (direction) => {
    this.setState((prevState) => {
      const newPageNo = direction === 'next' ? prevState.pageNo + 1 : prevState.pageNo - 1;
      if (newPageNo < 1 || newPageNo > prevState.totalPages) return null;
      return { pageNo: newPageNo };
    }, this.fetchMovies);
  };

  handleTabChange = (tab) => {
    this.setState({ activePage: tab, pageNo: 1 }, this.fetchMovies);
  };

  handleSearch = () => {
    // Implement search functionality if needed
  };

  render() {
    const { movies, pageNo, activePage, searchQuery } = this.state;

    return (
      <div className="movie-app">
        <h1>movieDB</h1>
        <div className="tabs">
          <button onClick={() => this.handleTabChange('Popular')}>Popular</button>
          <button onClick={() => this.handleTabChange('Top Rated')}>Top Rated</button>
          <button onClick={() => this.handleTabChange('Upcoming')}>Upcoming</button>
        </div>
        <div className="search-bar">
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => this.setState({ searchQuery: e.target.value })}
          />
          <button onClick={this.handleSearch}>Search</button>
        </div>
        <div className="movie-list">
          {movies.map(movie => (
            <div key={movie.id} className="movie-item">
              <img src={movie.poster_path} alt={movie.title} />
              <h3>{movie.title}</h3>
              <p>Rating: {movie.vote_average}</p>
              <button>View Details</button>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button 
            disabled={pageNo === 1} 
            onClick={() => this.handlePageChange('prev')}
          >
            Prev
          </button>
          <p>{pageNo}</p>
          <button 
            disabled={pageNo === this.state.totalPages} 
            onClick={() => this.handlePageChange('next')}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default MovieApp;
