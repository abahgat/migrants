function CustomMarker(latlng, size, type, map) {
    this.latlng_ = latlng;
    this.size_ = size;
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
        div.className = "location-marker " + this.type_;
        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
        
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
    
    this.drawLocation = function(loc) {
		drawFixedSize(loc);
	}
	
	function drawFixedSize(loc) {
	    var position = new google.maps.LatLng(loc.latitude,loc.longitude);
	    var marker = new CustomMarker(position, 5, 'main', map);
		    
	}
	
	function drawWithSize(loc) {
	    var position = new google.maps.LatLng(loc.latitude,loc.longitude);
	    var homec = loc.homeCount;
		var currc = loc.currentCount;
	    if (homec < currc) {
		    var marker = new CustomMarker(position, 2*(homec+currc), 'current', map);
		    var marker = new CustomMarker(position, 2*homec, 'home', map);
		} else {
		    var marker = new CustomMarker(position, 2*(homec+currc), 'home', map);
		    var marker = new CustomMarker(position, 2*currc, 'current', map);
		}
	}
}