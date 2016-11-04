
function initMap() {
  var place = ['Delhi', 'West Bengal' , 'Bihar', 'Uttar Pradesh', 'Assam'];
  var map;
  var markers = [];     
  var mapApi = function() {
  // Constructor creates a new map - only center and zoom are required.
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 27.593684, lng: 75.96288},
      zoom: 4,
      mapTypeControl: false
    });
     
    this.locations =  [
      {title: 'Bihar', location: {lat: 27.2590444, lng: 84.0180642}},
      {title: 'Delhi', location: {lat: 28.6618976, lng: 77.2273958}},
      {title: 'West Bengal', location: {lat: 22.9867569, lng: 87.85497549999999}},
      {title: 'Uttar Pradesh', location: {lat: 26.8467088, lng: 80.9461592}},
      {title: 'Assam', location: {lat: 26.2006043, lng: 92.9375739}}
    ];

    this.makeMarkerIcon = function (markerColor) {
      this.markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
      return this.markerImage;
    }
    var largeInfowindow = new google.maps.InfoWindow({maxwidth: 50});
    var defaultIcon = this.makeMarkerIcon('0091ff');
    var highlightedIcon = this.makeMarkerIcon('FFFF24');
    this.getDefaultObjectAt = function(array, index) {
      return array[index] = array[index] || {};
    }

    google.maps.event.addDomListener(window, 'resize', function() {
          //largeInfowindow.open(this.map);
          //var center = this.map.getCenter();
      google.maps.event.trigger(this.map, "resize");
      //this.map.setCenter(center);
    });

    var populateInfoWindow = function(marker, infowindow) {
      console.log(marker.title);       
      var content;      
      if (infowindow.marker != marker) {       
        infowindow.setContent('');
        infowindow.marker = marker;
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
          
        function getStreetView(data, status) {
          var k=0;
          if (status == google.maps.StreetViewStatus.OK) {
            var nearStreetViewLocation = data.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(
              nearStreetViewLocation, marker.position);
            k=1;
            content = '<div><h2>' + marker.title + '</div>'+'<div style = "height:200px" id="pano"></div>';
            infowindow.setContent(content);
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };                    
          } 
          else {
            content = '<div><h2>' + marker.title + '</h2></div>' +'<div><h2>No Street View Found</h2></div>';
            infowindow.setContent(content);
          }

          var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+marker.title +'&format=json&callback=wikiCallback';

          var wikiRequestTimeout = setTimeout(function() {
          //$('#asynchronousreq').text("failed to load wikipedia resources");
            content+='failed to load wikipedia resources';
            infowindow.setContent(content);
            getPanorama();
          }, 8000);

          $.ajax({
            url:wikiUrl,
            dataType:'jsonp',
            success: function(response) {
            //$('#asynchronousreq').text('');
              var articleList = response[2];
              for( var i=0 ;i<articleList.length;i++) {
                article = articleList[i];
                content = infowindow.getContent(content);
                infowindow.setContent(content+article);
              
              };
              getPanorama();            
              clearTimeout(wikiRequestTimeout);
            }
              
          });
            function getPanorama() {
              if (k==1) {
                var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
              }
            }           
        }               

        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);          
        infowindow.open(this.map, marker);
          //content.open(map,marker);
      }

    }

    for (var i = 0; i < this.locations.length; i++) {
    // Get the position from the location array.
      var position = this.locations[i].location;
      var title = this.locations[i].title;
    // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: i
      });
          // Push the marker to our array of markers.
      markers.push(marker);
          // Create an onclick event to open the large infowindow at each marker.
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);       
      });      
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });
    }

    this.hideMarkers = function(markers1) {
      //console.log(markers1);
      //var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
      for (var i = 0; i < markers1.length; i++) {
        markers1[i].setMap(null);
          //bounds.extend(markers1[i].position);
      }
       // map.fitBounds(bounds);
    //markers.length = 0;
    }

    this.showMarkers = function(markers2) {
      for (var i = 0; i < markers2.length; i++) {
        markers2[i].setMap(this.map);
          //bounds.extend(markers1[i].position);
      }
    }

    //console.log(location2);
    
    this.markerOpener = function(location2) {
      console.log(markers);
      var markers1=[],markers2=[],z=0;
      console.log('bhuss');
      for (var i = 0;i< markers.length; i++) {
        for (var j = 0; j< location2.length; j++) {
          if(location2[j] == markers[i].title) {
            z+=1;
          }
          //location1.push(locations[i]);
        
        }

        if(z==0) {
          markers1.push(markers[i]);
        } 
        else {
          markers2.push(markers[i]);
        }
        z=0;
      }

      this.showMarkers(markers2);
      this.hideMarkers(markers1);            
    }
  
    this.animate = function(address) {
      var marker1;
      for (var i=0;i<markers.length;i++) {
        if(address==markers[i].title)
          marker1=markers[i];
        console.log(marker1);
      }
      marker1.setIcon(highlightedIcon);
    }

    this.noanimate = function(address) {
      var marker1;
      for (var i=0;i<markers.length;i++) {
        if(address==markers[i].title)
          marker1=markers[i];
        console.log(marker1);
      }
      marker1.setIcon(defaultIcon);
    }
      
    this.openList = function(address1) {
      var marker1;
      console.log(address1);
        // Initialize the geocoder.
    //var geocoder = new google.maps.Geocoder();
        // Get the address or place that the user entered.
      var address = address1;
      for (var i=0;i<markers.length;i++) {
        if(address==markers[i].title)
          marker1=markers[i];
        console.log(marker1);
      }
      populateInfoWindow(marker1,largeInfowindow);        
    }

  }


  var ViewModel = function() {

    this.places = ko.observableArray(place);
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%for hamburger
    var control = new mapApi();
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  
    var location = [];
  
    var input, filter, ul, li, a, i;
    this.query= ko.observable('');
    this.keyup=ko.computed( function() {
      input = document.getElementById("search-engine");
      filter = input.value.toUpperCase();
      var filter = input.value;
      i = this.places().length-1;    
      this.pla = ko.observableArray();    

      while(i>=0) {
        
        if(this.places()[i].toUpperCase().indexOf(this.query().toUpperCase()) > -1) {
          this.pla().push(this.places()[i]);
           
        } 

        else {

          console.log('do nothing');

        }

        i--;
        
      }
      //this.pla()=location;
      control.markerOpener(this.pla());
      
      return this.pla();
      
    },this);
  
    this.openinfo = function(data){
      console.log(data);
      control.openList(data);
    }

    this.toggle1 = function (data) {
      control.animate(data);
    }
    this.toggle2 = function (data) {
      control.noanimate(data);
    }
  
  }


  ko.applyBindings(new ViewModel());
}
function googleError(){
  alert('problem in page loading!Please check your internet connectivity');
}

        
