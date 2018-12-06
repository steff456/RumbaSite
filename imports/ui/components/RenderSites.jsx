import React, { Component } from 'react';
import ReactStars from 'react-stars';

class RenderSites extends Component {

    filteredSites(){
        return this.props.sites.filter(
            (site) => {
            return site.name.toLowerCase().indexOf(
                this.props.search.toLowerCase()) !== -1;
            }
        );            
    }

    renderSites(filteredSites) { //poner como key el índice sólo si es estrictamente necesario, en este caso se puede con g._id
        return filteredSites.map((g, i) => (
            <div className="card" key={g._id} onClick={() => this.props.showOneSite(g._id)}>
            <img onError={(e)=>{e.target.onerror = null; e.target.src="https://media-cdn.tripadvisor.com/media/photo-s/08/2c/a7/13/cloud-9-sky-bar-lounge.jpg"}}
                className="card-img" src={g.urlImage} alt="Norway"  />
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
        let filteredSites = this.filteredSites();
        return (
            <div>
            {
               filteredSites.length === 0 ?
               (<div className="noSitesError"><h3>¡Ups! There are not sites</h3></div>)
               :
                (<div className="cards">
                    {this.renderSites(filteredSites)}
                </div>)    
            } 
            </div>           
        );
    }
}

//faltan los propTypes

export default RenderSites;