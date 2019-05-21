
var database;
var fireUser = null;
var indexMinimalLength = 4;
var itsMe = false;
var lastComment= null;

let themas = [
	"vanillajs",
	"jquery",
	"csharp",
	"vuejs",
	"canvas",
	"anything",
	"github",
	"about"

]


$(document).ready(function () {
	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	})
	var page = window.location.hash.replace("#","").toLowerCase();

	if(page==""){
		page = "about"
	}
	
	if(themas.indexOf(page) == -1){
		page = "cyberLost"
	}
	
	init(page);

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
			itsMe = (user.email == "pmg.meyer@gmail.com");
			
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

function errData(err){
	console.log("error !");
	console.log(err);
}

$("#googleAuth").on("click", function () {
	var provider = new firebase.auth.GoogleAuthProvider();
	provider.addScope('profile');
	provider.addScope('email');
	firebase.auth().signInWithPopup(provider).then(function(result) {
	 // This gives you a Google Access Token.
	 var token = result.credential.accessToken;
	 // The signed-in user info.
	 var user = result.user;
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
});

$("#githubAuth").on("click", function () {
	var provider = new firebase.auth.GithubAuthProvider();
	firebase.auth().signInWithPopup(provider).then(function(result) {
	// This gives you a GitHub Access Token. You can use it to access the GitHub API.
	var token = result.credential.accessToken;
	// The signed-in user info.
	$("#errorMessage").html("");

	var user = result.user;
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
	// ...
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	  	fireUser = null;
		$(".whenOff").removeClass("hide");
		$(".whenOn").addClass("hide");
		$("#userMessage").text("");
	    $("#errorMessage").html("<i class='fas fa-exclamation-circle'></i> " + errorMessage);
	});
});

  
 $(".navbar-nav li").on("click", function () {
	 	var attr = $(this).attr('id');
	 if(attr){
		  var menuItem = $(this).find("a").attr('href').replace("#","").toLowerCase();
		  init(menuItem);
	 }
});

 $("#thema-bar li").on("click", function () {
	 	var menuItem  = $(this).data('language');
		if(menuItem == "github"){
			document.location.href="https://github.com/PhilippeMarcMeyer";
		}else{
		  init(menuItem);
		}
});


function init(page) {
	if(page ==	"cyberLost"){
		window.location.hash = "";
		$("#cyberLostZone").show();
	}else{
		window.location.hash = page;
		themas.forEach(function(x){
			if(x == page){
				$("#" + x + "Zone").show();
				$("#" + x).addClass("active");	
			}else{
				$("#" + x + "Zone").hide();
				$("#" + x).removeClass("active");				
			}
		});
	}
	
	if(page = "rlanguage"){
		var h = window.innerHeight-450;
		if(h >200){
			$("#Learning-R").prop("height",h+"px");	
		}
		$("#Learning-R").show();
		}else{
			$("#Learning-R").hide();
		}
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
			let entriesPerCategory = {};
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
					var $searchField = $("#"+category+"Zone .searchField");
					var search = "";
					if($searchField.length > 0){
						search = $searchField.val().toLowerCase().trim().split(" ");
					}
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
							
							if(entriesPerCategory[category] == undefined) {
								entriesPerCategory[category] = 0;
								let $maindiv = $("<div></div>");
								$maindiv
									.addClass('row no-gutters');
									
								let $divLeft = $("<div></div>");
								$divLeft
									.addClass('col-lg-6 col-md-12 col-sm-12')
									.attr('id',category+"-left");
								
								$divLeft.appendTo($maindiv);	
								
								let $divRight = $("<div></div>");
								$divRight
									.addClass('col-lg-6 col-md-12 col-sm-12')
									.attr('id',category+"-right");
								
								$divRight.appendTo($maindiv);
								$maindiv.appendTo($ptr);
							}
							entriesPerCategory[category] ++;

							    let html = "";
								html += "<b class='subject'>"+data.Subject+"</b>&nbsp;by&nbsp;"+author+"&nbsp;on&nbsp;"+when+"<br />";
								html += data.Body.replace(/[\n\r]/g, '<br />')+'<br />';
								html += "<button type='button' data-target='#post-"+category+"' data-id='"+key+"' class='whenOn newComment btn btn-sm btn-default'>New Comment</button><br />";
								html += "<div class='whenOff hide inviteToLogAndComment'>Please log to leave comments</div>";

								if(data.Comments){
									var keys = Object.keys(data.Comments)
									html += "<br /><b class='comment-title'>Comments : </b><br />";
									keys.forEach(function(k){
										var comment = data.Comments[k];
										var when = new Date(comment.Creation).toLocaleString();
										var commentHtml = "<div class='comment-post'><b>"+comment.Author+"</b>&nbsp;on&nbsp;"+when+"<br />" + comment.Body.replace(/[\n\r]/g, '<br />')+"</div><br />";
										html += commentHtml;
									});
								}
								html += "<button type='button'  data-id='"+key+"' data-category='"+category+"' class='whenOn post-edit btn btn-sm btn-default'>Edit</button>&nbsp;";
								html += "<button type='button'  data-id='"+key+"' data-category='"+category+"' class='whenOn post-delete btn btn-sm btn-default'>Delete</button><hr />";
								if(entriesPerCategory[category] % 2 == 1){
									$("#"+category+"-left").append(html);
								}else{
									$("#"+category+"-right").append(html);
								}
								/*
								$ptr.append("</div>")
							if(entriesPerCategory[category] % 3 == 0){
								$ptr.append("</div>");
							}
							*/
						}
					}
				}
			});
			$(".static-post").removeClass("hide");
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
	
	$(".newComment").on("click",function(){
		
		var key = $(this).data("id");
		var formId = $(this).data("target");
		var $form = $(formId);
		var category = $form.data("category");

		$("#commentModal")
			.data("category",category)
			.data("key",key);
			
		$("#modal-error").text("");
		$("#modal-comment-text").val("");
		
		$("#modal-comment").show();
	});
	
	$(".modal-cancel").on("click",function(){
		$("#modal-comment").hide();
		lastComment = null;
	});
	
	$(".modal-save").on("click",function(){
		var author;
		var error = "";
		var $commentModal = $("#commentModal");
		var category = $commentModal.data("category");
		var key = $commentModal.data("key");
		var comment = $("#modal-comment-text").val().trim();
      	if(fireUser){
			if(fireUser.displayName){
				author = fireUser.displayName;
			}else{
				author = fireUser.email;
			}
			if(comment.length <5){
				error = "Please type something";
			}
		}else{
			error = "You are not identified";
		}
		if(error == ""){
			let dontShout = false;
			let thisComment = {key:key,text:comment};
			if(lastComment != null){
				if(lastComment.key == thisComment.key && lastComment.text == thisComment.text){
					$("#modal-comment").hide();
					return;
				}
			}
			lastComment = {key:key,text:comment};
			var now = new Date().toISOString();
			var keywords = index(comment,indexMinimalLength);
			$("#htmlRemover").html(comment);
			comment = $("#htmlRemover").html();
			var refComments = database.ref("Posts/"+key+"/Comments");
			  refComments.push({
				  Creation: now,
				  Author:author,
				  Body:	comment
				},function(error){
				  if (error){
					error = error.message;
				  }
			}); 
		}
		if(error == ""){
			$("#modal-comment").hide();
		}else{
			$("#modal-error").text(error);
		}
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
	
	  document.querySelectorAll('pre code').forEach(function(block){
		hljs.highlightBlock(block);
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
	for(let i = output.length -1 ; i >=0;i--){
		let doDelete = false;
		if(output[i].indexOf("_") > -1){
			doDelete = true;
		}
		let test = parseInt(output[i]);
		if(!isNaN(test)){
			doDelete = true;
		}
		if(doDelete){
			output.splice(i,1);
		}
	}
	return output;
}

function setBestFontSize(maxWidth, inlineDivPtr,fontsizeToTest) {
	var divWidth = inlineDivPtr.width();
	if (divWidth > maxWidth) {
		fontsize = fontsizeToTest || parseInt(inlineDivPtr.css("font-size").replace("px", ""));
		if (!isNaN(fontsize)) {
			var ratio = maxWidth / divWidth;
			fontsize = Math.floor(ratio * fontsize);
			inlineDivPtr.css("font-size", fontsize + "px");
			if (fontsize > 1) {
				setBestFontSize(maxWidth, inlineDivPtr, fontsize-1);
			}
		}
	}
}
