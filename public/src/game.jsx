/** @jsx React.DOM */

var Game = React.createClass({
    getInitialState() {

        return {playing: true, images: []};
    },
    componentDidMount: function() {

        var self = this;
        var images = [];

        $.ajax({
            url: 'http://www.flickr.com/services/rest/?method=flickr.photos.getRecent&format=json&per_page=6&api_key=ac2595fc19d820ccda1c1efc636be360',
            dataType: 'jsonp',
            type: 'GET',
            jsonpCallback: 'jsonFlickrApi',
            success: function(data){

                data.photos.photo.forEach(function(photo){

                    images.push("http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg");

                });

                self.setState({
                    images: _.shuffle(images.concat(images))
                });

            }
        });

    },
    render() {
        return (
            <Board
                images={this.state.images}
                max={this.state.images.length / 2}
            />
        );
    }
});
