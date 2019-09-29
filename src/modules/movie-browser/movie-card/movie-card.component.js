import React from 'react';
import {connect} from 'react-redux';
import {Avatar, Card, CardTitle, CardMedia, CardHeader} from 'material-ui';
// import { makeStyles, Theme, createStyles } from 'material-ui/core/styles';
import {openMovieModal} from '../movie-modal/movie-modal.actions';
// import { red } from 'material-ui/core/colors';
import range from 'lodash/range';
import styled from 'styled-components';
import ItemsCarousel from 'react-items-carousel';

// These are inline styles

const noOfItems = 12;
const noOfCards = 3;
const autoPlayDelay = 2000;
const chevronWidth = 40;

const Wrapper = styled.div`
  padding: 0 ${chevronWidth}px;
  max-width: 1000px;
  margin: 0 auto;
`;

const SlideItem = styled.div`
  height: 200px;
  background: #EEE;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
`;

const carouselItems = range(noOfItems).map(index => (
  <SlideItem key={index}>
    {index+1}
  </SlideItem>
));

// You can pass styles as objects using this convention
const styles = {
  cardMedia: {
    maxHeight: 394,
    overflow: 'hidden'
  },
  card: {
    cursor: 'pointer',
    height: 400,
    overflow: 'hidden'
  },
  bgImage: {
    width: '100%'
  }
};



// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     card: {
//       maxWidth: 345,
//     },
//     media: {
//       height: 0,
//       paddingTop: '56.25%', // 16:9
//     },
//     expand: {
//       transform: 'rotate(0deg)',
//       marginLeft: 'auto',
//       transition: theme.transitions.create('transform', {
//         duration: theme.transitions.duration.shortest,
//       }),
//     },
//     expandOpen: {
//       transform: 'rotate(180deg)',
//     },
//   }),
// );

class MovieCardComponent extends React.Component {
  constructor(props) {
    super(props);
    // Track if the mouse hovering over the movie card
    this.state = {
      isMouseOver: false,
      activeItemIndex: 0
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, autoPlayDelay);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  tick = () => this.setState(prevState => ({
    activeItemIndex: (prevState.activeItemIndex + 1) % (noOfItems-noOfCards + 1),
  }));

  onChange = value => this.setState({ activeItemIndex: value });
  render() {
    const {movie, openMovieModal} = this.props;
    // The CardTitle.subtitle won't render if it's null
    const subtitle = this.state.isMouseOver ? movie.overview : null;
 
    return (
      <Card
        style={styles.card}
        onMouseOver={() => this.setState({isMouseOver: true})}
        onMouseLeave={() => this.setState({isMouseOver: false})}
        onClick= {() => openMovieModal(movie.id)}
      >
      <CardHeader
        avatar={
          <Avatar aria-label="recipe">
            {movie.vote_average}
          </Avatar>
        }
        title={movie.title}
      />
        <CardMedia
          style={styles.cardMedia}
          overlay={
            <CardTitle
              title={movie.vote_average} 
              subtitle={subtitle} 
            />
          }
        >
          <img style={styles.bgImage} src={movie.poster_path} />
        </CardMedia>
      </Card>
    );
  }
}

export default connect(
  () => ({}),
  { openMovieModal }
)(MovieCardComponent);
