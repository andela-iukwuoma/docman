import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Nav from '../components/layouts/Nav.jsx';
import loader from '../img/loader.gif';

class App extends React.Component {
  render() {
    return (
      <div>
        <Nav />
        {this.props.children}
        { this.props.loading && <img className="mainLoader" src={loader} />}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    loading: state.ajaxCallsInProgress > 0
  };
}

export default connect(mapStateToProps)(App);
