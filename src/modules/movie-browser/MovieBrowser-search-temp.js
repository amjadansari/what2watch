import React from 'react';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import {AppBar, TextField, RaisedButton} from 'material-ui';
import * as movieActions from './movie-browser.actions';
import * as movieHelpers from './movie-browser.helpers';
import MovieList from './movie-list/movie-list.component';
import * as scrollHelpers from '../common/scroll.helpers';
import MovieModal from './movie-modal/movie-modal.container';

class MovieBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      currentMovies: [],
      query:''
    };
    // Binds the handleScroll to this class (MovieBrowser)
    // which provides access to MovieBrowser's props
    // Note: You don't have to do this if you call a method
    // directly from a lifecycle method
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.onscroll = this.handleScroll;
    // this.props.searchMovies(this.state.query, this.state.currentPage);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const {movieSearch} = this.props;
    if (!movieSearch.isLoading) {
      let percentageScrolled = scrollHelpers.getPercentageScrolledDown(window);
      if (percentageScrolled > .8) {
        const nextPage = this.state.currentPage + 1;
        this.props.searchMovies(this.state.query, nextPage);
        this.setState({currentPage: nextPage});
      }
    }
  }

  handleChange(e) {
    const {movieSearch} = this.props;
    if (!movieSearch.isLoading) {
      // let percentageScrolled = scrollHelpers.getPercentageScrolledDown(window);
      const nextPage = this.state.currentPage + 1;
      const query = e.target.value;
      console.log("query", query);
      this.setState({query: query});
      if (query.length > 3){
        this.props.searchMovies(this.state.query, this.state.currentPage);
      }
      this.setState({currentPage: nextPage});
    }
  }

  render() {
    const {topMovies} = this.props;
    const {movieSearch} = this.props;
    console.log("topMovies", topMovies);
    console.log("movieSearch", movieSearch);
    const movies = movieHelpers.getMoviesList(movieSearch.response);

    return (
      <div>
        <AppBar title='what2watch' />
        <Grid>
          <Row>
            <input className="testing" value={this.state.query} onChange={(e) => {this.handleChange(e)}} />
            <button onClick={this.handleChange.bind(this)}>submit</button>
          </Row>
          <Row>
            <MovieList movies={movies} isLoading={movieSearch.isLoading} />
          </Row>
        </Grid>
        <MovieModal />
      </div>
    );
  }
}

export default connect(
  // Map nodes in our state to a properties of our component
  (state) => ({
    topMovies: state.movieBrowser.topMovies,
    movieSearch: state.movieBrowser.movieSearch
  }),
  // Map action creators to properties of our component
  { ...movieActions }
)(MovieBrowser);
