var pictureSource;   // picture source
var destinationType; 
document.addEventListener("deviceready",onDeviceReady,false);

function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

var pictureSource = navigator.camera.PictureSourceType;
var destinationType = navigator.camera.DestinationType;

function uploadImage(){	
	alert('called upload pic');
	//Using library            
	navigator.camera.getPicture(uploadPhoto, onFailcapturePhoto, { quality: 50, 
		destinationType: destinationType.FILE_URI, sourceType: pictureSource.PHOTOLIBRARY});
}

function onFailcapturePhoto(message) {    
	alert("Message = " + message);
}

function uploadPhoto(imageURI) {
	if (imageURI.substring(0,21)=="content://com.android") {
	    photo_split=imageURI.split("%3A");
	    imageURI="content://media/external/images/media/"+photo_split[1];
	    alert('new uri'+imageURI);
	}

	if(!localStorage.imageArray) {
		var imageArray = [];
		imageArray.push(imageURI);
		localStorage.setItem('imageArray',JSON.stringify(imageArray));
		alert(JSON.stringify(imageArray));
	} else {
		var imagefile = JSON.parse(localStorage.imageArray);
		imagefile.push(imageURI);
		localStorage.setItem('imageArray',JSON.stringify(imagefile));
		alert(JSON.stringify(imagefile));
	}
}

function syncData() {
	var selectedImageArray = new Array();
	function readFile(index) {
		if( index >= JSON.parse(localStorage.imageArray).length ) {
			if(selectedImageArray.length == 0) return;			
			var selectedImageData = {
				title : 'updated on Wedness Day',
				type : 'residential',
				residentialKind : 'flat in apartment',
				location : 'Silk Board',
				bhk : '2BHK',
				road : 'Outer Ring Road',
				no : 'No.42',
				developer : 'Star Developers',
				nameOfBuilding : 'MSM Aparments',
				purpose : 'rent',
				images : selectedImageArray
			};
			alert('going to call the api to sync the data');		
			$.ajax({
				url : 'http://54.187.220.194:1337/listings/add',
				type : 'POST',
				dataType : 'JSON',
				contentType : 'application/json',
				data : JSON.stringify(selectedImageData)
			})
			.done(function(res) {
				alert('success='+JSON.parse(res));
				localStorage.clear();
			})
			.error(function(err) {
				alert('error='+JSON.parse(err));
			}); 
		} else {
			var filePath = JSON.parse(localStorage.imageArray)[index];
			window.resolveLocalFileSystemURI(filePath, function(entry) {
				var reader = new FileReader();

				reader.onloadend = function(evt) {
					selectedImageArray.push(evt.target.result);
		            readFile(index+1);
				}

				reader.onerror = function(evt) {
				      alert('read error');
				      alert(JSON.stringify(evt));
				  }

				entry.file(function(s) {
				    reader.readAsDataURL(s)
				}, function(e) {
				    alert('error='+e);
				});

			});
		}		
	}
	readFile(0);
}




