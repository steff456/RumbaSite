import React from 'react';
import { Sites } from '../../api/sites.js'
import PropTypes from 'prop-types';
import ReactStars from 'react-stars'
import { Header, Image } from 'semantic-ui-react'
import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

const role = Roles.userIsInRole(Meteor.user(), ['client'])

const Modal = ({ handleClose, handleAdd, show, raiting}) => {
  return (
    <div className={show ? "modal display-block" : "modal display-none"}>
      <section className="modal-main">
        <textarea></textarea>
        <ReactStars
          className="card-starts"
          count={5}
          size={30}
          value={raiting}
          color2={'#ffd700'} />
        <button onClick={handleAdd} disabled={true}>Add</button>
        <button onClick={handleClose}>Close</button>
      </section>
    </div>
  );
};

class AllSites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSite: null,
      search: '',
      show: false
    }
    this.showOneSite = this.showOneSite.bind(this);
    this.showModal = this.showModal.bind(this);
    this.addComment = this.addComment.bind(this);
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  renderSites() {
    console.log(this.props.sites)
    let filteredSites = this.props.sites.filter(
      (site) => {
        return site.name.toLowerCase().indexOf(
          this.state.search.toLowerCase()) !== -1;
      }
    );

    if (filteredSites.length === 0) {
      return (<div className="error"><h3>¡Ups! There are not results for your search</h3></div>)
    }


    return filteredSites.map((g, i) => (
      <div className="card" key={i} onClick={() => this.showOneSite(g._id)}>
        <img className="card-img" src="http://wac.2f9ad.chicdn.net/802F9AD/u/joyent.wme/public/wme/assets/ec050984-7b81-11e6-96e0-8905cd656caf.jpg" alt="Norway" />
        <div className="card-text">
          <h2>{g.name}</h2>
        </div>
        <ReactStars
          className="card-starts"
          count={5}
          size={20}
          edit={false}
          value={g.raiting}
          color2={'#ffd700'} />
      </div>
    ));
  }

  updateSearch(event) {
    this.setState({
      search: event.target.value.substr(0, 20)
    });
  }

  showOneSite(id) {
    if (id !== null) {
      id = id._str;
    }
    this.setState({
      showSite: id,
    });
  }

  renderComments(comments) {
    if (comments.length === 0) {
      return (<div className="error2"><h3>¡Ups! There are not comments yet</h3></div>)
    }
    return comments.map((g, i) => (
      <div className="comment" key={i}>
        <h4>{g.user} :</h4> {g.comment}
      </div>
    ));
  }
  renderSite() {
    let filteredSite = this.props.sites.filter(
      (site) => {
        return site._id._str === this.state.showSite;
      }
    );

    if (filteredSite.length === 0) {
      this.setState({
        showSite: null,
      });
      return (<div></div>)
    }

    return filteredSite.map((g, i) => (
      <div key={i}>
        <div className="card-detail-img">
        </div>
        <div className="card-detail">
          <div className="other-sites" onClick={() => this.showOneSite(null)}>
            Other sites
            </div>
          <div className="card-detail-header">
            <h1>{g.name}</h1>
            <h3>{g.address}</h3>
            <ReactStars
              className="card-starts"
              count={5}
              size={20}
              edit={false}
              value={g.raiting}
              color2={'#ffd700'} />
          </div>
          <div className="card-detail-comments">
            {this.renderComments(g.comments)}
          </div>
          <Modal show={this.state.show}
           handleClose={this.hideModal}
           handleAdd={this.addComment}
           raiting={g.raiting}>
          </Modal>
          <div className="add-comment" onClick={this.showModal}>
            Add comment
            </div>
        </div>
      </div>
    ));
  }

  addComment() {
    console.log("HOLA")
  }

  render() {
    return (
      <div>
        {this.state.showSite !== null ?
          (<div>
            {this.renderSite()}
          </div>) :
          (<div>
            <div className="search-bar">
              <input type="text"
                value={this.state.search}
                onChange={this.updateSearch.bind(this)}
                placeholder="Search site" />
            </div>
            <div className="cards">
              {this.renderSites()}
            </div>
          </div>)
        }
      </div>
    );
  }
}

AllSites.propTypes = {
  sites: PropTypes.array.isRequired,
};

export default withTracker(() => {
  Meteor.subscribe('sites');
  return {
    sites: Sites.find({}).fetch(),
    currentUser: Meteor.user(),
  };
})(AllSites);