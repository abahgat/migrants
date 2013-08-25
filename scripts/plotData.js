function CustomMarker(latlng, size, title, type, map) {
    this.latlng_ = latlng;
    this.size_ = size;
    this.title_ = title;
    this.type_ = type;
    this.setMap(map);
}
CustomMarker.prototype = new google.maps.OverlayView();
CustomMarker.prototype.draw = function() {
    var me = this;
    var div = this.div_;
    if (!div) {
        div = this.div_ = document.createElement('DIV');
        div.style.border = "solid 1px #fff";
        div.style.position = "absolute";
        div.style.paddingLeft = "0px";
        div.style.paddingTop = "0px";
        div.style.cursor = 'pointer';
        div.style.width = this.size_ + "px";
        div.style.height = this.size_ + "px";
        div.title = this.title_;
		// div.onmouseover = function() { 
		// 	$(div).popover('show');
		// };
        div.className = "location-marker " + this.type_;
        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
		// $(div).popover({content: 'content', placement: 'above'});
        
    }
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (point) {
        // make sure the x, y coordinates correctly denote the center of the circle
        div.style.left = (point.x-this.size_/2) + 'px';
        div.style.top = (point.y-this.size_/2) + 'px';
    }
};
CustomMarker.prototype.getPosition = function() {
    return this.latlng_;
};

function Plotter(map) {
    this.map = map;
    
    var arcs = {};
    
    this.drawArc = function(from, to) {
        var akey = from.id + to.id;
        if (arcs[akey]) {
            console.log('Duplicate edge found ' + akey);
            return;
        }
        var points = [
            new google.maps.LatLng(from.latitude,from.longitude),
            new google.maps.LatLng(to.latitude,to.longitude)
            ];
        var line = new google.maps.Polyline({
            path: points,
            strokeColor: "#FCD116",
            strokeOpacity: 0.75,
            strokeWeight: 1
            // ,
            // geodesic: true
        });

        line.setMap(map);
        arcs[akey] = line;
    }
    
    this.drawLocation = function(loc, name) {
		drawFixedSize(loc, name);
	}
	
	function drawFixedSize(loc, name) {
	    var position = new google.maps.LatLng(loc.latitude,loc.longitude);
	    var marker = new CustomMarker(position, 5, name, 'main', map);
	}
	
	function drawWithSize(loc, name) {
	    var position = new google.maps.LatLng(loc.latitude,loc.longitude);
	    var homec = loc.homeCount;
		var currc = loc.currentCount;
	    if (homec < currc) {
		    var marker = new CustomMarker(position, 2*(homec+currc), name, 'current', map);
		    var marker = new CustomMarker(position, 2*homec, name, 'home', map);
		} else {
		    var marker = new CustomMarker(position, 2*(homec+currc), name, 'home', map);
		    var marker = new CustomMarker(position, 2*currc, name, 'current', map);
		}
	}

    this.drawMe = function(user) {
        $('.upic').attr('src', 'http://graph.facebook.com/' + user.id + '/picture?type=square');
        $('.uname').attr('href', user.link);
        $('.uname').append(user.name);
        $('.upic').show();
    }
}
