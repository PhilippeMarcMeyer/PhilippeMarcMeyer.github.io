
var database;
var fireUser = null;
$(document).ready(function () {
	
	var url = location.href;
	var arr = url.split("#");
	if(arr.length == 2){
		var page = arr[1];
		if(page !=""){
			init(page.toLowerCase());
		}
	}
	

	
  var config = {
    apiKey: "AIzaSyCdE3mJVWexNDOh83rNA5S29N2KK5gcy-c",
    authDomain: "first-firebase-project-5ada0.firebaseapp.com",
    databaseURL: "https://first-firebase-project-5ada0.firebaseio.com",
    projectId: "first-firebase-project-5ada0",
    storageBucket: "first-firebase-project-5ada0.appspot.com",
    messagingSenderId: "770548806963"
  };
  
  firebase.initializeApp(config);
  
	$("#btnLogin").on("click",function(){
		var email = $("#txtEmail").val();
		var pass = $("#txtPassword").val();
		var auth = firebase.auth();
		// Sign in
		var promise = auth.signInWithEmailAndPassword(email,pass);
		promise.catch(function(e){
			//console.log(e.message);
		});
	});
	$("#btnSignUp").on("click",function(){
		// TODO : check for email
		var doContinue = true;
		 $("#txtEmail").removeClass("error");
		var regex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
		var email = $("#txtEmail").val();
		var pass = $("#txtPassword").val();
		var auth = firebase.auth();
		// Sign in
		if(!regex.test(email)){
			doContinue = false;
			 $("#txtEmail").addClass("error");
		}else{
			 $("#txtEmail").removeClass("error");
		}
		
		if(doContinue){
			doContinue = pass !="";
		}
		
		if(doContinue){
			var promise = auth.createUserWithEmailAndPassword(email,pass);
			promise.catch(function(e){
				//console.log(e.message);
			});
		}
	});  
  	$("#btnLogout").on("click",function(){
		var auth = firebase.auth();
		// Sign out
		auth.signOut();

	});
	
	firebase.auth().onAuthStateChanged(function(user){
		if(user){
			fireUser = user;
			 $(".whenOn").removeClass("hide");
			 $(".whenOff").addClass("hide");
			if(user.displayName){
				$("#userMessage").html("You are logged as "+user.displayName+"&nbsp;&nbsp;&nbsp;");
			}else{
				$("#userMessage").html("You are logged as "+user.email+"&nbsp;&nbsp;&nbsp;");
			}
	
		}else{
			fireUser = null;
			$(".whenOff").removeClass("hide");
			$(".whenOn").addClass("hide");
			$("#userMessage").text("");
//displayName
		}
	});

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

	$(".cancel").off("click").on("click",function(){
		$("#firebaseEdit").hide();
		$("#firebaseEdit #key").val("");
		$("#firebaseEdit #title").val("");
		$("#firebaseEdit #text").val("");
	});
	
	
	$(".new").off("click").on("click",function(){
		$("#firebaseEdit").show();
		$("#firebaseEdit #key").val("");
		$("#firebaseEdit .keyzone").hide();
		$("#firebaseEdit #title").val("");
		$("#firebaseEdit #text").val("");
		$("#firebaseEdit #error").text("");

	});



	$(".save").off("click").on("click",function(){
					
		var key = $("#firebaseEdit #key").val();
		var title = $("#firebaseEdit #title").val();
		var text = $("#firebaseEdit #text").val();
		
		if(title !="" && text != ""){
			if(key!=""){
				now = new Date().toISOString();
				ref.child(key)
					.update({ 
						Subject: title, 
						Body: text,
						//Creation:"2018-08-16T10:02:10.384Z",
						Modification:now 
					},function(error){
						 if (error){
							$("#firebaseEdit #error").text(error.message);
						 }
					  else{
						 $("#firebaseEdit").hide();
						 $("#firebaseEdit #key").val("");
						 $("#firebaseEdit #title").val("");
						 $("#firebaseEdit #text").val("");
					  }
				  });
			}else{
				now = new Date().toISOString();
				ref.push({
				  Subject:title,
				  Creation: now,
				  Body:	text,
				  Modification:"no"					
				},function(error){
					 if (error){
					$("#firebaseEdit #error").text(error.message);
					 }
				  else{
					 $("#firebaseEdit").hide();
					 $("#firebaseEdit #key").val("");
					 $("#firebaseEdit #title").val("");
					 $("#firebaseEdit #text").val("");
				  }
					
				}); 
			}
			
			
		}else{
			$("#firebaseEdit #error").text("Please type something...");

		}

		
	});
	
	function showStatus(s){
		//console.log(s);
	}
 //ref.push(data); 
ref.on('value',gotData,errData);

// Pull from firebase for "firebase" page
function gotData(data){
	var obj = data.val();
	var entries = Object.entries(obj);	
	entries.sort(function(a,b){
		var d1 = new Date(a[1].Creation);
		var d2 = new Date(b[1].Creation);
		return d1.getTime() <= d2.getTime();
	});

	var html="";
	entries.forEach(function(p){
		var key = p[0];
		var data = p[1];
		var when = new Date(data.Creation).toLocaleString();
		if(data.Modification != "no"){
			when += " + modified : " + new Date(data.Modification).toLocaleString();
		}
		html+="<b class='subject'>"+data.Subject+"</b>&nbsp;"+when+"<br />";
		html+= data.Body.replace(/[\n\r]/g, '<br />')+'<br />';+'<br />';
		html+= "<button type='button'  data-id='"+key+"' class='whenOn edit btn btn-sm btn-default'>Edit</button>";
		html+= "<button type='button'  data-id='"+key+"' class='whenOn delete btn btn-sm btn-default'>Delete</button>";

		html+= "<hr />";	

	});
	html = html.replace(/<br \/><br \/>/g, '<br \/>')+"<br />";
	
	$("#firebaseZone").html(html);
	if(!fireUser){
		$(".whenOff").removeClass("hide");
		$(".whenOn").addClass("hide");
	}

	
	$(".edit").off("click").on("click",function(){
		var key = $(this).data("id");
		ref.child(key).on("value",function(x){
			
			window.scroll({
			 top: 0, 
			 left: 0, 
			 behavior: 'smooth' 
			});
		
			var data = x.val();
			$("#firebaseEdit #key").val(key);
			$("#firebaseEdit #title").val(data.Subject);
			$("#firebaseEdit #text").val(data.Body);
			$("#firebaseEdit").show();
			$("#firebaseEdit .keyzone").show();
			$("#firebaseEdit #error").text("");


		});
		
	});
	
	$(".delete").off("click").on("click",function(){
		var key = $(this).data("id");
		$("#modal-ok").data("id",key);
		$('#myModal').modal();
	});
	
	$("#modal-ok").off("click").on("click",function(){
		var key = $(this).data("id");
		ref.child(key).remove();
	});
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


 var refPosts = database.ref("Posts");
 refPosts.on('value',gotDataPost,errDataPost);
 
 

 function errDataPost(err){
	console.log("error in post !");
	console.log(err);
}
// Pull from firebase site for posts in all pages (except firebase special page)
function gotDataPost(data){

	var obj = data.val();
		if(obj){
			var entries = Object.entries(obj);	
			entries.sort(function(a,b){
				var d1 = new Date(a[1].Creation);
				var d2 = new Date(b[1].Creation);
				return d1.getTime() <= d2.getTime();
			});

			entries.forEach(function(p){
				var key = p[0];
				var data = p[1];
				var category = data.Category;
				$("#"+category+"-posts").html("");
			});
			
			entries.forEach(function(p){
				var key = p[0];
				var data = p[1];
				var category = data.Category;
				var author = data.Author || "anonymous";
				var when = new Date(data.Creation).toLocaleString();
				if(data.Modification != "no"){
					when += " + modified : " + new Date(data.Modification).toLocaleString();
				}
				var $ptr = $("#"+category+"-posts");
				if($ptr.length==1){
					$ptr.append("<b class='subject'>"+data.Subject+"</b>&nbsp;by&nbsp;"+author+"&nbsp;on&nbsp;"+when+"<br />");
					$ptr.append(data.Body.replace(/[\n\r]/g, '<br />')+'<br />');
					$ptr.append("<button type='button'  data-id='"+key+"' data-category='"+category+"' class='whenOn post-edit btn btn-sm btn-default'>Edit</button>&nbsp;");
					$ptr.append("<button type='button'  data-id='"+key+"' data-category='"+category+"' class='whenOn post-delete btn btn-sm btn-default'>Delete</button>");
					$ptr.append("<hr />");
				}
			});
	}

	if(!fireUser){
		$(".whenOff").removeClass("hide");
		$(".whenOn").addClass("hide");
	}



// edit for comments could be interesting : only for the poster
	$(".post-edit").off("click").on("click",function(){
		
		var key = $(this).data("id");
		var category = $(this).data("category");
		var formId = "#post-" + category;
		
		refPosts.child(key).on("value",function(x){
			window.scroll({
			 top: 0, 
			 left: 0, 
			 behavior: 'smooth' 
			});
		
			var data = x.val();
			$(formId+ " .post-key").val(key);
			$(formId+ " .post-title").val(data.Subject);
			$(formId+ " .post-text").val(data.Body);
			$(formId+ " .keyzone").show();
			$(formId+ " .post-error").text("");
			$(formId).show();
		});
		
	});
	
	$(".post-delete").off("click").on("click",function(){
		var key = $(this).data("id");
		$("#post-del-ok").data("id",key);
		$('#post-del-modal').modal();
	});
	
	$("#post-del-ok").off("click").on("click",function(){
		var key = $(this).data("id");
		refPosts.child(key).remove();
	});
	
	$(".post-cancel").off("click").on("click",function(){
		var $form = $(this).parent();
		var formId = "#" + $form.attr("id");
		var category = $form.data("category");
		
		$(formId + " .post-key").val("");
		$(formId + " .post-title").val("");
		$(formId + " .post-text").val("");
		$(formId + " .keyzone").hide();
		$(formId + " .post-error").text("");
		
		$form.hide();
	});
	
	//commentModal
	
	
	$(".post-new").off("click").on("click",function(){
		var formId = $(this).data("target");
		var $form = $(formId);
		var category = $form.data("category");
		
		$(formId + " .post-key").val("");
		$(formId + " .post-title").val("");
		$(formId + " .post-text").val("");
		$(formId + " .keyzone").hide();
		$(formId + " .post-error").text("");
		
		$form.show();
	});
	

	$(".post-save").off("click").on("click",function(){
		var $form = $(this).parent();
		var formId = "#" + $form.attr("id");
		var category = $form.data("category");
		
		var author ="anonymous";
		if(fireUser){
			if(fireUser.displayName){
				author = fireUser.displayName;
			}else{
				author = fireUser.email;
			}
		}
		var key = $(formId + " .post-key").val();
		var title = $(formId + " .post-title").val();
		var text = $(formId + " .post-text").val();
		
		if(title !="" && text != ""){
			if(key!=""){
				now = new Date().toISOString();
				refPosts.child(key)
					.update({ 
						Subject: title, 
						Body: text,
						Modification:now 
					},function(error){
						 if (error){
							$(formId + " .post-error").text(error.message);
						 }
					  else{
						 $form.hide();
						 $(formId + " .post-key").val("");
						 $(formId + " .post-title").val("");
						 $(formId + " .post-text").val("");
					  }
				  });
			}else{
				  now = new Date().toISOString();
				  refPosts.push({
				  Subject:title,
				  Creation: now,
				  Category:category,
				  Author:author,
				  Body:	text,
				  Modification:"no"					
				},function(error){
				  if (error){
					$(formId + " .post-error").text(error.message);
				  }
				  else{
					 $form.hide();
					 $(formId + " .post-key").val("");
					 $(formId + " .post-title").val("");
					 $(formId + " .post-text").val("");
				  }
				}); 
			}
		}else{
			$(formId + " .post-error").text("Please type something...");
		}		
	});
}


});
