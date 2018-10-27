import React from 'react';
import { Sites } from '../../api/sites.js'
import PropTypes from 'prop-types';
import ReactStars from 'react-stars'
import { Roles } from 'meteor/alanning:roles'
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

const role = Roles.userIsInRole(Meteor.user(), ['client'])

const Modal = ({ handleClose, handleAdd, show, children, disabledB }) => {

  return (
    <div className={show ? "modal display-block" : "modal display-none"}>
      <section className="modal-main">
        {children}
        <button onClick={handleAdd} disabled={disabledB == ""}>Add</button>
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
      show: false,
      comment:'',
      commentRaiting: 0
    }
    this.starsRef = React.createRef();

    this.showOneSite = this.showOneSite.bind(this);
    this.showModal = this.showModal.bind(this);
    this.changeRat = this.changeRat.bind(this);
    this.handleChangeTextArea = this.handleChangeTextArea.bind(this);
    this.addComment = this.addComment.bind(this);
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  renderSites() {
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
            disabledB={this.state.comment}>
            <textarea autoFocus value={this.state.comment} onChange={this.handleChangeTextArea}></textarea>
            <ReactStars
              id = "stars"
              className="card-starts"
              count={5}
              size={30}
              color2={'#ffd700'}
              ref={this.starsRef} 
              onChange={this.changeRat}
              value={this.state.commentRaiting}
              />
          </Modal>
          <div className="add-comment" onClick={this.showModal}>
            Add comment
            </div>
        </div>
      </div>
    ));
  }

  changeRat(val){
    console.log(val + "===")
    this.setState({ commentRaiting: val });
  }
  handleChangeTextArea(e) {
    this.setState({comment: e.target.value})
  }

  addComment() {
    let sites = this.props.sites.filter(
      (site) => {
        return site._id._str === this.state.showSite;
      }
    );
    let siteComments = sites[0].comments;
      
    let siteRaiting = ((sites[0].raiting * siteComments.length) + this.state.commentRaiting)/(siteComments.length + 1);
    siteComments.push({
      user: this.props.currentUser.username,
      comment: this.state.comment,
      raiting: this.state.commentRaiting
    });

    Meteor.call('sites.comment.add', this.state.showSite, siteComments,siteRaiting, (err, site) => {
      if (err) {
        alert(err);
        return;
      }
      this.hideModal();
      this.setState({
        comment:''
      });
    });
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