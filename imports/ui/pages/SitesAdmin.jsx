import React from 'react'
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Sites } from '../../api/sites.js'
import PropTypes from 'prop-types';
import ReactStars from 'react-stars'
import { Header, Input, Form, Button, Divider } from 'semantic-ui-react';
import  RenderSites  from '../components/RenderSites';
import CryptoJS from 'crypto-js';
import axios from 'axios';

//Aquí hay un serio problema de mantenibilidad, el código debería estar más modularizado.

const Modal = ({ handleClose, ok, show, children, name,address, img }) => {
  return (
    <div className={show ? "modal display-block" : "modal display-none"}>
      <section className="modal-main">
        {children}
        <Form>
            <Divider />
            <Button onClick={ok} disabled={name===''|| address==='' || img=== null}>Ok</Button>
            <Button onClick={handleClose}>Cancel</Button>
        </Form>
      </section>
    </div>
  );
};

const imgOnError = 'https://cdn-image.foodandwine.com/sites/default/files/1501607996/opentable-scenic-restaurants-marine-room-FT-BLOG0818.jpg'


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
      imgFile:null,
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
    this.onChangeImgFile = this.onChangeImgFile.bind(this);
    this.changeImgFileState = this.changeImgFileState.bind(this);
    this.postToCloud = this.postToCloud.bind(this);
  }

  showModal = () => {
    this.setState({ 
      showEdit: true    
    });
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

  delete(evt) {
    evt.preventDefault();

    Meteor.call('sites.delete', this.state.showSite, (err, site) => {
      if (err) {
        alert(err);
        return;
      }
    });

    this.setState({
      showSite: null,
      name:'',
      address:'',
      imgFile:null      
    });

    this.hideModalDelete();
  }

  create(imgUrl){
    Meteor.call('sites.new', 
      this.state.name, 
      this.state.address, 
      imgUrl,
      (err, site) => {
        if (err) {
          alert(err);
          return;
        }       
      }
    );
    this.setState({
      name:'',
      address:'',
      imgFile:null      
    });
    this.hideModalNew();
  }

  update(imgUrl) {
    Meteor.call('sites.update',
      this.state.showSite,
      this.state.name,
      this.state.address,
      imgUrl,
      (err, site) => {
        if (err) {
          alert(err);
          return;
        }
      });
    this.hideModal();
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
    let comm =  comments.reverse().map((g, i) => (      
      <div className="comment" key={i}>
        <h4>{g.user} :</h4> {g.comment}
      </div>
    ));

    return (
      <div>
          <h5 className="comment-number">Number of comments: {comments.length}</h5>
          {comm}
      </div>
    );
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
        name:'',
        address:'',
        imgFile:null
      });
      return (<div></div>)
    }

    return filteredSite.map((g, i) => (
      <div key={i}>
        <div className="card-detail-img" style={{ "background": "url(" + g.urlImage + "), url("+ imgOnError +")" }}>
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
            <Modal show={this.state.showEdit} handleClose={this.hideModal} ok={()=>this.postToCloud('Edit')} >
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
                <Input type="file" id="imgInputEdit" onChange={()=> this.onChangeImgFile('Edit')}  accept="image/*"/>
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

  showOneSite(id) {
    if (id !== null) {
      id = id._str;
    }
    this.setState({
      showSite: id,
    }); 
  }

  postToCloud(name){
    if(this.state.imgFile !== null){
      let df = new FormData();
      let timestamp =  + new Date();
      let signature = 'timestamp=' + timestamp + Meteor.settings.public.stripe.SECRET_CLOUDINARY;
      df.set('file', this.state.imgFile);
      df.set('api_key', Meteor.settings.public.stripe.API_KEY_CLOUDINARY);
      df.set('timestamp', timestamp );
      df.set('signature', CryptoJS.SHA1(signature));

      axios({
        method: 'post',
        url: 'https://api.cloudinary.com/v1_1/uniandes/image/upload',
        data: df,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
        })
        .then(function (response) {   
          if(name === 'Add')
            this.create(response.data.secure_url);  
          else
            this.update(response.data.secure_url)
          
          this.setState({
            imgFile: null
          });
        }.bind(this))
        .catch(function (response) {
            console.log(response);
       });
      }
      else{
        if(name === 'Add')
         this.create(imgOnError);  
        else
          this.update(imgOnError);
      }
  }

  changeImgFileState(file){
    this.setState({
      imgFile: file
    });
  }

  onChangeImgFile(name){
    var reader = new FileReader();
    reader.changeImgFileState = this.changeImgFileState;
    reader.onload = function() {
      var arrayBuffer = this.result,
      array = new Uint8Array(arrayBuffer)
    }
    reader.onloadend = function(){
      this.changeImgFileState(reader.result);
    }
    let myInput = document.getElementById('imgInput'+ name);
    reader.readAsDataURL(myInput.files[0]);
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

              <Modal show={this.state.showNew} handleClose={this.hideModalNew} ok={()=> this.postToCloud('Add')} name={this.state.name} address={this.state.address} img={this.setState.imgFile}>
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
                    <label>URL Image (Optional)</label>
                    <Input type="file" id="imgInputAdd" onChange={()=> this.onChangeImgFile('Add') }  accept="image/*"/>
                  </Form.Field>                  
                </Form>
              </Modal>
              <div className="add-comment edit" onClick={this.showModalNew}>
                Add new site
              </div>
            </div> 

            <RenderSites search={this.state.search} sites={this.props.sites} showOneSite={this.showOneSite}/>       
          </div>
          
          )
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