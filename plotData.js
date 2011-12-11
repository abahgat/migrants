function Plotter(map) {
    this.map = map;
    
    this.drawLocation = function(location) {
		var myLatlng = new google.maps.LatLng(location.latitude,location.longitude);
		var marker = new google.maps.Marker({
		    position: myLatlng,
		    //animation: google.maps.Animation.DROP,
		    title: location.name
		});
		marker.setMap(map);
	}
}