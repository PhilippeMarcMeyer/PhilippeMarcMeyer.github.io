
 /* 
  var database = firebase.database();
  var ref = database.ref("scores");
  var data = {
	  name:"PHM",
	  score:44
  }
  ref.push(data);
  */



var database;

$(document).ready(function () {
	
	var url = location.href;
	var arr = url.split("#");
	if(arr.length == 2){
		var page = arr[1];
		if(page !=""){
			init(page.toLowerCase());
		}
	}
	
	
	
	console.log("Path Beyond URL - ",location.href);
	
  var config = {
    apiKey: "AIzaSyCdE3mJVWexNDOh83rNA5S29N2KK5gcy-c",
    authDomain: "first-firebase-project-5ada0.firebaseapp.com",
    databaseURL: "https://first-firebase-project-5ada0.firebaseio.com",
    projectId: "first-firebase-project-5ada0",
    storageBucket: "first-firebase-project-5ada0.appspot.com",
    messagingSenderId: "770548806963"
  };
  firebase.initializeApp(config);
  database = firebase.database();
  // when I wanna submit something :
 var ref = database.ref("Knowledge");
 var now = new Date().toISOString();
  var data = {
		/*
	  Subject:"Experimenting firebase",
	  Creation: "2018-08-16T11:01:01.091Z",
	  Body:	"I recommend Daniel Shiffman tutorial on firebase\r\n<a href='https://www.youtube.com/watch?v=NcewaPfFR6Y'>Firebase Tutorial</a>\r\nMy first try is to input data to the server. I create a js object corresponding to a firebase record and push it to the server !",
	  Modification:"no"
  */
	  Subject:"Satisfaction",
	  Creation: now,
	  Body:"What I like very much is that each time an input is sent to the server, then the page receives an event with new data refreshed !",
	  Modification:"no"
	
}
 //ref.push(data); 
ref.on('value',gotData,errData);

function gotData(data){
	var posts = Object.values(data.val());
	console.log(posts);
	posts.sort(function(a,b){
		var d1 = new Date(a.Creation);
		var d2 = new Date(b.Creation);
		return d1.getTime() > d2.getTime();
	});

	var html="";
	posts.forEach(function(p){
		var when = new Date(p.Creation).toLocaleString();
		html+="<b>"+p.Subject+"</b>&nbsp;"+when+"<br />";
		html+= p.Body.replace(/[\n\r]/g, '<br />')+"<hr />";

		
	});
	html = html.replace(/<br \/><br \/>/g, '<br \/>')+"<br />";
	$("#firebaseZone").html(html);
}

function errData(err){
	console.log("error !");
	console.log(err);
}
  
 $(".navbar-nav li").on("click", function () {
	  var menuItem = $(this).find("a").attr('href').replace("#","").toLowerCase();
       init(menuItem);
});

function init(menuItem) {
    var menus = $(".navbar-nav li");
    $.each(menus, function (index, menu) {
        if (menu.id == menuItem) {
            $("#" + menu.id + "Zone").show();
            $("#" + menu.id).addClass("active");
        } else {
            $("#" + menu.id + "Zone").hide();
            $("#" + menu.id).removeClass("active");
        }
    });
}


	   // Settings like width and height, le id of the modal zone.  allowSearch gives you a search field
	 var aConfig ='{"width":"700px","height":"316px","modal":"myModal","allowSearch":"yes"}';
		
		// Defining the header of the grid : colums names (matching data), types , titles and width
		// Supported types are : number, string and  mm-dd-yyyy, mm/dd/yyyy, dd-mm-yyyy, dd/mm/yyyy
	 var aHeader = '{"arr":[{"name":"firstname","type":"string","title":"First name","width":"200px"},{"name":"lastname","type":"string","title":"Last name","width":"200px"},{"name":"birthdate","type":"mm-dd-yyyy","title":"Birthdate","width":"150px"},{"name":"langage","type":"string","title":"Langage","width":"150px"}]}';
		// This json string should be provides by the back-end : here for demonstration purpose
		// It's an objet containing an array 'arr' of objects representing the rows of our grid
		// You provide for each cell, the name (which must match the name in the header) and the value
	var aData = '{"arr":[{"firstname":"Bjarne ","lastname":"Stroustrup","birthdate":"12-30-1950","langage":"C++"},{"firstname":"Denis","lastname":"Ritchie","birthdate":"09-09-1941","langage":"C"},{"firstname":"Kenneth","lastname":"Thompson","birthdate":"02-04-1943","langage":"Go"},{"firstname":"James","lastname":"Gosling","birthdate":"05-19-1955","langage":"Java"},{"firstname":"Brendan ","lastname":"Eich","birthdate":"07-04-1961","langage":"Javascript"},{"firstname":"Guido","lastname":"Van Rossum","birthdate":"01-31-1956","langage":"Python"},{"firstname":"Yukihiro","lastname":"Matsumoto","birthdate":"04-14-1965","langage":"Ruby"},{"firstname":"Roberto","lastname":"Lerusalimschy","birthdate":"05-21-1960","langage":"Lua"},{"firstname":"Rasmus","lastname":"Lerdorf","birthdate":"11-22-1968","langage":"Php"},{"firstname":"Jean","lastname":"Ichbiah","birthdate":"03-25-1940","langage":"Ada"}]}';
		
		// Optional feature (you don't need to set it via SetTranslations)
		// By default a button New title is 'New', you change it to localize or just to provide another title like "Add" 
		// Don't change the key, change the value ex : "New":"Nuevo" (Nuevo is new in spanish)
		
	var aTranslation ='{"New":"New","Modifying":"Modifying","Adding":"Adding","Delete":"Delete","Cancel":"Cancel","Validate":"Validate","Search":"Search","Save":"Save"}';
		
		// Calling SimpleGrid : param1 : grid zone id, param2 : id of the grid itself, param3 : grid class (I propose grid-table grid-table-1 but you may write your own css)
	var myGrid = new SimpleGrid("zone","tableId","grid-table grid-table-1");
		
	myGrid.SetConfig(aConfig); // Settting the config
		
	myGrid.config.save = function(){// Declaring the saving function
		// retreaving data
		var json = myGrid.getData();
		// You got to make your own saving function to localstorage or back-end !
		alert('You got to send this Json string to your backend !\r\n'+json);
	}
	myGrid.SetTranslations(aTranslation); // Setting translation if needed    
	myGrid.SetHeader(aHeader); // Setting the hearder with names, types and width
	myGrid.SetData(aData); // Setting the data to populate the rows
	myGrid.Draw(); // Drawing the grid in it's zone 
});



