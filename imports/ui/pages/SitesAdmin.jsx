import React from 'react'
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Sites } from '../../api/sites.js'
import PropTypes from 'prop-types';
import ReactStars from 'react-stars'
import { Header, Input, Form, Button, Divider } from 'semantic-ui-react';

const Modal = ({ handleClose, ok, show, children }) => {
  return (
    <div className={show ? "modal display-block" : "modal display-none"}>
      <section className="modal-main">
        {children}
        <Form>
            <Divider />
            <Button onClick={ok}>Ok</Button>
            <Button onClick={handleClose}>Cancel</Button>
        </Form>
      </section>
    </div>
  );
};

/** Seria bueno que un administrador no pudiera añadir un nuevo sitio sin llenar todos los campos requeridos del sitio ( nombre , direccion y imagen )
*
* Tambien considero que seria bueno mostrar aletas al momento de la adicion del nuevo sitio como para que uno de admin sepa si el sitio fue agregado correctamente 
* esto igualmente cuando se va a editar un sitio.
*/

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
        <img onError={(e)=>{e.target.onerror = null; e.target.src="https://media-cdn.tripadvisor.com/media/photo-s/08/2c/a7/13/cloud-9-sky-bar-lounge.jpg"}}
         className="card-img" src={g.urlImage} alt="Norway" />
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
        <div className="card-detail-img" style={{ "background": "url(" + g.urlImage + "), url(https://cdn-image.foodandwine.com/sites/default/files/1501607996/opentable-scenic-restaurants-marine-room-FT-BLOG0818.jpg)" }}>
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
              <Header as='h4' textAlign='center' className="padding-text">Are you sure, you want to delete this site?</Header>
            </Modal>
            <div className="delete" onClick={this.showModalDelete}>
              Delete
            </div>
            <Modal show={this.state.showEdit} handleClose={this.hideModal} ok={this.update}>
              <Header 
              as='h2' 
              className="padding-text" 
              dividing 
              textAlign='center'
            > 
              Edit Site
            </Header>
            <Form>
              <Form.Field className="edit-element">
                <label>Site Name</label>
                <Input type="text" defaultValue={g.name} placeholder={g.name} onChange={this.updateName} />
              </Form.Field>
              <Form.Field className="edit-element">
                <label>Site Address</label>
                <Input type="text" defaultValue={g.address} placeholder={g.address} onChange={this.updateAddress} />
              </Form.Field>
              <Form.Field className="edit-element">
                <label>URL Image</label>
                <Input type="text" defaultValue={g.urlImage} label="https://" placeholder={g.urlImage} onChange={this.updateUrlImage} />
              </Form.Field>
            </Form>
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
              <Input type="text"
                value={this.state.search}
                onChange={this.updateSearch.bind(this)}
                placeholder="Search site" />

              <Modal show={this.state.showNew} handleClose={this.hideModalNew} ok={this.create}>
                <Header 
                  as='h2' 
                  className="padding-text" 
                  dividing 
                  textAlign='center'
                > 
                  New Site
                </Header>
                <Form>
                  <Form.Field className="edit-element">
                    <label>Site Name</label>
                    <Input type="text" placeholder="Name" onChange={this.updateName} />
                  </Form.Field>
                  <Form.Field className="edit-element">
                    <label>Site Address</label>
                    <Input type="text" placeholder="Address" onChange={this.updateAddress} />
                  </Form.Field>
                  <Form.Field className="edit-element">
                    <label>URL Image</label>
                    <Input type="text" label="https://" placeholder="URL image" onChange={this.updateUrlImage} />
                  </Form.Field>
                </Form>
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
