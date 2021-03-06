import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, Link, hashHistory} from 'react-router';
import Responsive from 'react-responsive';

// Use Skeleton styling boilerplate
import 'shared_styles/skeleton.less'

// Import React components
import HelloWorld from 'components/Test/HelloWorld';
import Header from 'components/Header/Header';
import Nav from 'components/Nav/Nav';
import NavItem from 'components/Nav/NavItem/NavItem';
import MainContent from 'components/MainContent/MainContent';
import Title from 'components/MainContent/Title/Title';
import SquareLoader from 'components/SquareLoader/SquareLoader';
import Icon from 'components/Icon/Icon';

// Import "widgets"
import LogIn from 'widgets/LogInWidget/LogInWidget';
import LogWeight from 'widgets/LogWeightWidget/LogWeightWidget';
import Visualize from 'widgets/VisualizeWeightWidget/VisualizeWeightWidget';
import LogMeal from 'widgets/LogMealWidget/LogMealWidget';
import ReviewDay from 'widgets/ReviewDayWidget/ReviewDayWidget';


// Default (desktop, tablet) and mobile setup
const Desktop = ({ children }) => <Responsive minWidth={768} children={children} />;
const Mobile = ({ children }) => <Responsive maxWidth={768} children={children} />;

class App extends React.Component {
  
  constructor() {
    super();  
    this.state=({
      offset: 0,
      loggedIn: false,
      fetching: true,
      width: window.innerWidth,
      showNav: false
    });
    this.headerOffsetHandler = this.headerOffsetHandler.bind(this);
    this.loggedInHandler = this.loggedInHandler.bind(this);
    this.fetchHandler = this.fetchHandler.bind(this);
    this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this);
    this.mobileNavClickHandler = this.mobileNavClickHandler.bind(this);
  }
  
  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }
  
  componentDidMount() {
    getAuthenticationStatus().then(loggedOn =>{
      this.loggedInHandler(loggedOn);
      this.fetchHandler(false);
    });
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }
  
  handleWindowSizeChange () {
    this.setState({ width: window.innerWidth });
  }
  
  // Offset body from header
  headerOffsetHandler (height) {
    this.setState({offset:height});
  }
  
  loggedInHandler(logged) {
    this.setState({loggedIn:logged});
  }
  
  fetchHandler(is_fetching) {
    this.setState({fetching: is_fetching});
  }
  
  mobileNavClickHandler() {
    this.setState({showNav:!this.state.showNav});
  }
  
  hideNav() {
    console.log('hiding nav');
    this.setState({showNav:false});
  }
  
  renderDashBoard() {
    if (this.state.fetching) {
      return (
        <SquareLoader offset={this.state.offset}></SquareLoader>
      );
    }
    if (this.state.loggedIn) {
      return (
        <div style={{height:window.innerHeight-this.state.offset}}>
          <Desktop>
            <Nav className="desktop"/>
          </Desktop>
          <Mobile>
            <Nav className="mobile" show={this.state.showNav} expandHeight={window.innerHeight-this.state.offset} hideNav={this.hideNav.bind(this)}/>
          </Mobile>
          {this.props.children}
        </div>
      );
    } else {
      return (
        <LogIn checkLoggedIn={this.loggedInHandler} checkFetch={this.fetchHandler}/>
      );
    }
  }
  
  render () {
    return (
      <div>
        <Header headerOffsetFunc={this.headerOffsetHandler}> 
          <Link to = "/" className = "header-title">DashFit </Link>
          <Mobile>
            <Icon className="icon-menu3" onClick={this.mobileNavClickHandler}/>
          </Mobile>
        </Header>
        {this.renderDashBoard()}
      </div>
    );
  }
}

function getAuthenticationStatus() {    
  return fetch('/login',{
    method:'GET',
    credentials: 'include'
  }).then(res =>{
    return res.json();
  });  
}

//TODO: Look into way to cache state upon component unmount 
//      so fewer server calls are made
render((
  <Router history = {hashHistory}>
    <Route path = "/" component = {App}>
      <IndexRoute component = {LogWeight}/>
      <Route path = "weight" component = {LogWeight}/>
      <Route path = "visualize" component = {Visualize}/>
      <Route path = "meals" component = {LogMeal} />
      <Route path = "review-day" component = {ReviewDay} />
    </Route>
  </Router>
),document.getElementById('app'));