import React, { Component } from 'react';
import ReactStars from 'react-stars';

class RenderSites extends Component {

    renderSites() {
        let filteredSites = this.props.sites.filter(
            (site) => {
            return site.name.toLowerCase().indexOf(
                this.props.search.toLowerCase()) !== -1;
            }
        );

        if (filteredSites.length === 0) {
            return (<div className="error"><h3>¡Ups! We couldn't find sites where you are owner</h3></div>)
        }


        return filteredSites.map((g, i) => (
            <div className="card" key={i} onClick={() => this.props.showOneSite(g._id)}>
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
    render() {
        return (
            <div className="cards">
                {this.renderSites()}
            </div>
        );
    }
}

export default RenderSites;