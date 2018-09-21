
var database;
var fireUser = null;
var indexMinimalLength = 4;
var itsMe = false;

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
				itsMe = (user.email == "pmg.meyer@gmail.com");
			}
			
		}else{
			fireUser = null;
			$(".whenOff").removeClass("hide");
			$(".whenOn").addClass("hide");
			$("#userMessage").text("");
		}
		if(!itsMe){
			 $(".myEyesOnly").addClass("hide");
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
		var keywords = index(title+" "+text,indexMinimalLength);
		if(title !="" && text != ""){
			if(key!=""){
				now = new Date().toISOString();
				ref.child(key)
					.update({ 
						Subject: title, 
						Body: text,
						Keywords : keywords,
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
						 /*
						ref.child(key).child("Keywords").remove();
					  keywords.forEach(function(k){
						 ref.child(key).child("Keywords").push(k); 
					  });
					   */
					  }
				  });

			
	
			}else{
				now = new Date().toISOString();
				ref.push({
				  Subject:title,
				  Creation: now,
				  Body:	text,
				  Modification:"no",
				  Keywords:keywords
				},function(error){
					 if (error){
					$("#firebaseEdit #error").text(error.message);
					 }
				  else{
					 $("#firebaseEdit").hide();
					 $("#firebaseEdit #key").val("");
					 $("#firebaseEdit #title").val("");
					 $("#firebaseEdit #text").val("");
					 /*
					  keywords.forEach(function(k){
							  ref.child(key).child("Keywords").push(k); 
					  });
					*/
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
	if(obj==null) return;
	var search = $("#firebaselearningZone .searchField").val().toLowerCase().trim().split(" ");
	
	var entries = Object.entries(obj);	
	entries.sort(function(a,b){
		var d1 = new Date(a[1].Creation);
		var d2 = new Date(b[1].Creation);
		return d2.getTime() - d1.getTime();
	});

	var html="";
	entries.forEach(function(p){
		var gotIt = true;
		var key = p[0];
		var data = p[1];
		var when = new Date(data.Creation).toLocaleString();
		
		if(data.Modification != "no"){
			when += " + modified : " + new Date(data.Modification).toLocaleString();
		}
		
		if(search.length !=0 && search[0]!=""){
			gotIt = false;
			search.forEach(function(k){
				if(k.length >=5){
					if(data.Keywords.indexOf(k)!=-1){
						gotIt = true;	
					}
				}
			});
		}

		if(gotIt){
			html+="<b class='subject'>"+data.Subject+"</b>&nbsp;"+when+"<br />";
			html+= data.Body.replace(/[\n\r]/g, '<br />')+'<br />';+'<br />';
			html+= "<button type='button'  data-id='"+key+"' class='whenOn edit btn btn-sm btn-default'>Edit</button>";
			html+= "<button type='button'  data-id='"+key+"' class='whenOn delete btn btn-sm btn-default'>Delete</button>";

			html+= "<hr />";	
		}
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
	 	var attr = $(this).attr('id');
	 if(attr){
		  var menuItem = $(this).find("a").attr('href').replace("#","").toLowerCase();
		  init(menuItem);
	 }
});

function init(menuItem) {
    var menus = $(".navbar-nav li");
    $.each(menus, function (index, menu) {
		var attr = $(this).attr('id');
		if(attr){
			if (menu.id == menuItem) {
				$("#" + menu.id + "Zone").show();
				$("#" + menu.id).addClass("active");
			} else {
				$("#" + menu.id + "Zone").hide();
				$("#" + menu.id).removeClass("active");
			}
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
				p.when = new Date(data.Creation).getTime();
			});
			
			entries.sort(function(a,b){
				return b.when - a.when;
			});
			
			entries.forEach(function(p){
				var key = p[0];
				var data = p[1];
				var category = data.Category;
				if(category){
				var author = data.Author || "anonymous";
				var when = new Date(data.Creation).toLocaleString();
				if(data.Modification != "no"){
					when += " + modified : " + new Date(data.Modification).toLocaleString();
				}
				
				var search = $("#"+category+"Zone .searchField").val().toLowerCase().trim().split(" ");
				var gotIt = true;
				if(search.length !=0 && search[0]!=""){
					gotIt = false;
					search.forEach(function(k){
						if(k.length >=indexMinimalLength){
							if(data.Keywords.indexOf(k)!=-1){
								gotIt = true;	
							}
						}
					});
				}
				if(gotIt){
					var $ptr = $("#"+category+"-posts");
					if($ptr.length==1){
						$ptr.append("<b class='subject'>"+data.Subject+"</b>&nbsp;by&nbsp;"+author+"&nbsp;on&nbsp;"+when+"<br />");
						$ptr.append(data.Body.replace(/[\n\r]/g, '<br />')+'<br />');
						$ptr.append("<button type='button' data-target='#post-"+category+"' data-id='"+key+"' class='whenOn newComment btn btn-sm btn-default'>New Comment</button><br />");
						$ptr.append("<div class='whenOff hide inviteToLogAndComment'>Please log to leave comments</div>");

						if(data.Comments){
							var keys = Object.keys(data.Comments)
							$ptr.append("<br /><b class='comment-title'>Comments : </b><br />");
							keys.forEach(function(k){
								var comment = data.Comments[k];
								var when = new Date(comment.Creation).toLocaleString();
								var commentHtml = "<div class='comment-post'><b>"+comment.Author+"</b>&nbsp;on&nbsp;"+when+"<br />" + comment.Body.replace(/[\n\r]/g, '<br />')+"</div><br />";
								$ptr.append(commentHtml);
							});
						}
						$ptr.append("<button type='button'  data-id='"+key+"' data-category='"+category+"' class='whenOn post-edit btn btn-sm btn-default'>Edit</button>&nbsp;");
						$ptr.append("<button type='button'  data-id='"+key+"' data-category='"+category+"' class='whenOn post-delete btn btn-sm btn-default'>Delete</button>");
						$ptr.append("<hr />");
					}
				}
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
		$(formId).data("comment","false");

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
			$(formId+ " .titlezone").show();
			$(formId+ " .post-error").text("");
			$(formId + " .post-title").removeClass("hide");

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
		$(formId+ " .titlezone").show();
		$(formId + " .post-error").text("");
		$(formId + " .post-title").removeClass("hide");

		$form.show();
	});
	
	$(".newComment").off("click").on("click",function(){
		
		var key = $(this).data("id");
		var formId = $(this).data("target");
		var $form = $(formId);
		var category = $form.data("category");
		
		$form.data("comment","true");
		
		$(formId+ " .post-key").val(key);

		$(formId + " .post-title").val("none");
		$(formId + " .titlezone").hide();
		$(formId + " .post-text").val("");
		$(formId + " .post-error").text("");
		
		$form.show();
	});
	
	

	$(".post-save").off("click").on("click",function(){
		var $form = $(this).parent();
		var formId = "#" + $form.attr("id");
		var category = $form.data("category");
		var isComment = ($form.data("comment")=="true");
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
		var keywords = index(title+" "+text,indexMinimalLength);
		if(title !="" && text != ""){
			if(key!=""){
				now = new Date().toISOString();
				if(isComment){
					$("#htmlRemover").html(text);
					text = $("#htmlRemover").text();
					 var refComments = database.ref("Posts/"+key+"/Comments");
					  refComments.push({
						  Creation: now,
						  Author:author,
						  Body:	text
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
					refPosts.child(key)
						.update({ 
							Subject: title, 
							Body: text,
							Modification:now,
							Keywords:keywords
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
				  now = new Date().toISOString();
				  refPosts.push({
				  Subject:title,
				  Creation: now,
				  Category:category,
				  Author:author,
				  Body:	text,
				  Modification:"no"	,
				  Keywords:keywords				  
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

$(".search").on("click",function(){
	var toSearchField = $(this).parent().find(".searchField");
	if(toSearchField.length==1){
		var category = $(toSearchField).data("category");
		if(category=="firebase"){
			ref.on('value',gotData,errData);
		}else{
			refPosts.on('value',gotDataPost,errDataPost);
		}
	}
});


});

function index (text,minLength){
	var indexes = {};
	var output = [];
	var start = -1;
	var end = -1;
	var textWithOutCode = text.replace(/[\W]+/g," ").toLowerCase();
	textWithOutCode = textWithOutCode.replace(/ {1,}/g," ");
	var words = textWithOutCode.split(" ");
	words.sort();
	var previous = null;
	words.forEach(function(word){
		if(word!=previous){
			previous = word;
			if(word.length >= minLength){
				if(!indexes[word]){
					indexes[word] = true;
					output.push(word);
				}
			}
		}
	});
	
	return output;
}
