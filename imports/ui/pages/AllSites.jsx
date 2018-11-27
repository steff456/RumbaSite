import React from 'react';
import { Sites } from '../../api/sites.js'
import PropTypes from 'prop-types';
import ReactStars from 'react-stars';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Header, Form, Button, Divider, Input } from 'semantic-ui-react';
import  RenderSites  from '../components/RenderSites';

const role = Roles.userIsInRole(Meteor.user(), ['client'])

const Modal = ({ handleClose, handleAdd, show, children, disabledB }) => {
  return (
    <div className={show ? "modal display-block" : "modal display-none"}>
      <section className="modal-main">
        {children}
        <Form>
          <Divider />
          <Button onClick={handleAdd} disabled={disabledB == ""}>Add</Button>
          <Button onClick={handleClose}>Close</Button>
        </Form>
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
      comment: '',
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
      return (<RenderSites search={this.state.search} sites={this.props.sites} showOneSite={this.showOneSite}/>)
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
          <Modal show={this.state.show}
            handleClose={this.hideModal}
            handleAdd={this.addComment}
            disabledB={this.state.comment}>
            <Header as='h2' dividing textAlign='center'>
              Add Comment
            </Header>
            <Form>
              <Form.TextArea placeholder='Tell us your opinion...' autoFocus value={this.state.comment} onChange={this.handleChangeTextArea}></Form.TextArea>
              <ReactStars
                id="stars"
                className="card-starts"
                count={5}
                size={20}
                color2={'#ffd700'}
                ref={this.starsRef}
                onChange={this.changeRat}
                value={this.state.commentRaiting}
              />
            </Form>
          </Modal>
          <div className="add-comment" onClick={this.showModal}>
            Add comment
          </div>
        </div>
      </div>
    ));
  }

  changeRat(val) {
    this.setState({ commentRaiting: val });
  }
  handleChangeTextArea(e) {
    this.setState({ comment: e.target.value })
  }

  addComment() {
    let sites = this.props.sites.filter(
      (site) => {
        return site._id._str === this.state.showSite;
      }
    );
    let siteComments = sites[0].comments;

    let siteRaiting = ((sites[0].raiting * siteComments.length) + this.state.commentRaiting) / (siteComments.length + 1);
    siteComments.push({
      user: this.props.currentUser.username,
      comment: this.state.comment,
      raiting: this.state.commentRaiting
    });

    Meteor.call('sites.comment.add', this.state.showSite, siteComments, siteRaiting, (err, site) => {
      if (err) {
        alert(err);
        return;
      }
      this.hideModal();
      this.setState({
        comment: ''
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
              <Input type="text"
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