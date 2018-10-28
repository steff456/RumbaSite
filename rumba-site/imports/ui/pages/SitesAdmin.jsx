import React from 'react'
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Sites } from '../../api/sites.js'
import PropTypes from 'prop-types';
import ReactStars from 'react-stars'

const Modal = ({ handleClose, ok, show, children }) => {
  return (
    <div className={show ? "modal display-block" : "modal display-none"}>
      <section className="modal-main">
        {children}
        <button onClick={ok}>Ok</button>
        <button onClick={handleClose}>Cancel</button>
      </section>
    </div>
  );
};


class SitesAdmin extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      search: '',
      showSite: null,
      showDelete: false,
      showEdit: false,
      showNew:false,
      name: '',
      address: '',
      urlImage: '',
      disableButton: true
    }

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModalNew = this.showModalNew.bind(this);
    this.hideModalNew = this.hideModalNew.bind(this);
    this.showModalDelete = this.showModalDelete.bind(this);
    this.hideModalDelete = this.hideModalDelete.bind(this);
    this.showOneSite = this.showOneSite.bind(this);
    this.delete = this.delete.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.updateUrlImage = this.updateUrlImage.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  showModal = () => {
    this.setState({ showEdit: true });
  };

  hideModal = () => {
    this.setState({ showEdit: false });
  };

  showModalNew = () => {
    this.setState({ showNew: true });
  };

  hideModalNew = () => {
    this.setState({ showNew: false });
  };

  showModalDelete = () => {
    this.setState({ showDelete: true });
  };

  hideModalDelete = () => {
    this.setState({ showDelete: false });
  };

  delete() {
    Meteor.call('sites.delete', this.state.showSite, (err, site) => {
      if (err) {
        alert(err);
        return;
      }
    });

    this.setState({
      showSite: null
    });

    this.hideModalDelete();
  }

  create(){
    Meteor.call('sites.new', 
      this.state.name, 
      this.state.address, 
      this.state.urlImage,
      (err, site) => {
        if (err) {
          alert(err);
          return;
        }
      }
    );
    this.hideModalNew();
  }

  update() {
    Meteor.call('sites.update',
      this.state.showSite,
      this.state.name,
      this.state.address,
      this.state.urlImage,
      (err, site) => {
        if (err) {
          alert(err);
          return;
        }
      });
    this.hideModal();
  }

  renderSites() {
    let filteredSites = this.props.sites.filter(
      (site) => {
        return site.name.toLowerCase().indexOf(
          this.state.search.toLowerCase()) !== -1;
      }
    );

    if (filteredSites.length === 0) {
      return (<div className="error"><h3>¡Ups! We couldn't find sites where you are owner</h3></div>)
    }


    return filteredSites.map((g, i) => (
      <div className="card" key={i} onClick={() => this.showOneSite(g._id)}>
        <img className="card-img" src={g.urlImage} alt="Norway" />
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

  renderComments(comments) {
    if (comments.length === 0) {
      return (<div className="error2"><h3>¡Ups! There are not comments yet</h3></div>)
    }
    return comments.reverse().map((g, i) => (
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
        <div className="card-detail-img" style={{ "background": "url(" + g.urlImage + ")" }}>
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

          <div className="admin-buttons">
            <Modal show={this.state.showDelete} handleClose={this.hideModalDelete} ok={this.delete}>
              <p className="padding-text">Are you sure, you want to delete this site?</p>
            </Modal>
            <div className="delete" onClick={this.showModalDelete}>
              Delete
            </div>
            <Modal show={this.state.showEdit} handleClose={this.hideModal} ok={this.update}>
              <p className="padding-text">Edit site</p>
              <div className="edit-element">
                <div className="edit-element-text">Name</div>
                <input type="text" defaultValue={g.name} onChange={this.updateName} />
              </div>
              <div className="edit-element">
                <div className="edit-element-text">Address</div>
                <input type="text" defaultValue={g.address} onChange={this.updateAddress} />
              </div>
              <div className="edit-element">
                <div className="edit-element-text">URL image</div>
                <input type="text" defaultValue={g.urlImage} onChange={this.updateUrlImage} />
              </div>
            </Modal>
            <div className="add-comment edit" onClick={this.showModal}>
              Edit
            </div>
          </div>
        </div>
      </div>
    ));
  }

  updateState(name, address, urlImage) {
    this.setState({
      name, address, urlImage
    });
  }

  updateName(evt) {
    this.setState({
      name: evt.target.value
    });
  }

  updateAddress(evt) {
    this.setState({
      address: evt.target.value
    });
  }

  updateUrlImage(evt) {
    this.setState({
      urlImage: evt.target.value
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

              <Modal show={this.state.showNew} handleClose={this.hideModalNew} ok={this.create}>
                <p className="padding-text">New site</p>
                <div className="edit-element">
                  <div className="edit-element-text">Name</div>
                  <input type="text" defaultValue="Name" onChange={this.updateName} />
                </div>
                <div className="edit-element">
                  <div className="edit-element-text">Address</div>
                  <input type="text" defaultValue="Address" onChange={this.updateAddress} />
                </div>
                <div className="edit-element">
                  <div className="edit-element-text">URL image</div>
                  <input type="text" defaultValue="https://" onChange={this.updateUrlImage} />
                </div>
              </Modal>
              <div className="add-comment edit" onClick={this.showModalNew}>
                Add new site
              </div>
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

SitesAdmin.propTypes = {
  sites: PropTypes.array.isRequired,
};

export default withTracker(() => {
  Meteor.subscribe('sites-admin');
  return {
    sites: Sites.find({}).fetch(),
    currentUser: Meteor.user(),
  };
})(SitesAdmin);