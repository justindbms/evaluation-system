	// removes ajax message after textbox focus
	function emptyElement()
	{
		$('#status').html("");
	}
	
	// registers user password on first login
	function validRegister()	
	{
		// get user input
		var logid = $('#logid').val();
		var currpass = $('#currpass').val();
		var password = $('#password').val();
		var repassword = $('#repass').val();
		
		var dataString = 'logid='+ logid + '&currpass=' + currpass +'&password='+ password + '&repass=' + repassword;
		
		// post request
		$.ajax({
			type: "POST",
			url: "/app/regpass",
			data: dataString,
			cache: false,
			success: function(result)
			{
				var result=trim(result);
				
				if(result=='correct')
				{
					window.location='/';
				}
				else $("#status").html(result);
			}
		});
		// clear the textboxes
		$('#currpass').val("");
		$('#password').val("");
		$('#repass').val("");
		
		return false;
	}
	
	function validLogin()
	{
		// get credentials
		var logid = $('#logid').val();
		var password = $('#password').val();
		
		var dataString = 'logid='+ logid + '&password='+ password;
		
		// post request
		$.ajax({
			type: "POST",
			url: "/app/auth",
			data: dataString,
			cache: false,
			success: function(result)
			{
				var result=trim(result);
				if(result=='correct')
				{
					window.location='/';
				} 
				else $("#status").html(result);
			}
		});
		// clear textbox
		$('#password').val("");

		return false;
	}

	function validChange()
	{
		// get user input
		var currpass = $('#currpass').val();
		var password = $('#password').val();
		var repassword = $('#repass').val();
		
		var dataString = 'currpass=' + currpass +'&password='+ password + '&repass=' + repassword;
		
		// post request
		$.ajax({
			type: "POST",
			url: "/app/change_pass",
			data: dataString,
			cache: false,
			success: function(result)
			{
				var result=trim(result);
				
				if(result=='correct')
				{
					window.location='/';
				}
				else $("#status").html(result);
			}
		});
		// clear the textboxes
		$('#currpass').val("");
		$('#password').val("");
		$('#repass').val("");
		
		return false;
	}
	
	function trim(str)
	{
		var str=str.replace(/^\s+|\s+$/,'');
		return str;
	}
	
	function updateRatings()
	{
		if ( !! document.getElementById('ratings-table'))
		{

			var link = "/app/calculate_ratings";
			
			$.get(link,{},function(){});
			displayRatings();
		}
	}
	
	function displayRatings()
	{
		
		if ( !! document.getElementById('ratings-table'))
		{
			$('.progress').css('display','block');
			$('#ratings-table').css('display','none');
			$(".error-ratings").empty();
			$('#ratings-table thead').empty();
			$('#ratings-table tbody tr').addClass('delete-this-row');
			$('.table-title-here').empty();
			var year = $("select[name=viewRatingYear]").val();
			var semester = $("select[name=viewRatingSemester]").val();
			var link = "/app/display_ratings/" + year + "/" + semester ;
			if(semester == "2") semstr = "2nd";
			else if(semester == "1") semstr = "1st";
			else semstr ="";
			$.get(link,{},function(response){
				if (response.status == 'OK' && Object.keys(response.results).length > 0)
				{	
					$('.table-title-here').append(
						"<div class='col s8 m8 l8'>\
							<div class='row'><h4 style='margin-bottom:0px;' class='rating-title'>Final Ratings</h4></div>\
							<div class='row'><h6 style='margin-top:0px;'>SY "+year.substring(0,4)+"-"+year.substring(4,8)+" "+semstr+" Semester</h6></div>\
						</div>\
						<div class='col s4 m4 l4 print-holder'>\
							<button class='waves-effect waves-light btn' id='exportThisRatings'>Download as csv</button>\
						</div>"
					);
					$("#ratings-table thead").append(
						"<tr>\
							<th>Teacher</th>\
							<th>TC Score</th>\
							<th>EA Score</th>\
							<th>AP Score</th>\
							<th>Student Score</th>\
							<th>Rating</th>\
						</tr>"
					);
					if (response.results != null)
					{
						response.results.forEach(function(teacher){
							$("#ratings-table tbody").append("<tr><td>" + teacher.name + "</td><td>" 
							+ teacher.tc+ "</td><td>" + teacher.ea+ "</td><td>" + teacher.ap+ "</td><td>" 
							+ teacher.student+ "</td><td>" + teacher.rating+ "</td></tr>");
						});
					}
					// else $("#ratings-table tbody").append("<tr><td>Data Not Available</td></tr>");
					$("#ratings-table").tablesorter({sortList: [[0,0]]});
					$('.delete-this-row').remove();
					$("#ratings-table").trigger("update");
					$('.progress').css('display','none');
					$('#ratings-table').css('display','table');
				}
				else {
					$('.table-title-here').append(
						"<div class='col s8 m8 l8'>\
							<div class='row'><h4 style='margin-bottom:0px;' class='rating-title'>Final Ratings</h4></div>\
							<div class='row'><h6 style='margin-top:0px;'>SY "+year.substring(0,4)+"-"+year.substring(4,8)+" "+semstr+" Semester</h6></div>\
						</div>"
					);
					$(".error-ratings").html("Data not available");
					$('.progress').css('display','none');
				}
			});
		}
	}
	
	displayUserSettingsInfo();
	function displayUserSettingsInfo() {
		if ( !! document.getElementById('editAccountInfo'))
		{
			var link = "/app/user_settings_info/"+ $("#manageUserForm [name=editTargetId]").val();
						
			$.get(link,{},function(response){
				$('#editAccountInfo').append("<li>User Login ID: " + response.info.logid + "</a></li>");

				$("#manageUserForm [name=editUsertype]").val(response.info.type);
				$("#manageUserForm [name=editUname]").val(response.info.name);
				
				if (response.info.gradelevel !== '' && response.info.section !== '')
				{
					$('#manageUserForm [name=editUserGradelevel]').val(response.info.gradelevel);
					$('#manageUserForm [name=editUserSection]').val(response.info.section);
				}
				
				if (response.info.subject !== '' && response.info.cluster !== '' && response.info.level !== '' )
				{
					$('#manageUserForm [name=editUserUserSubject]').val(response.info.subject);
					$('#manageUserForm [name=editUserCluster]').val(response.info.cluster);
					$('#manageUserForm [name=editUserLevel]').val(response.info.level);
				}
				
				if (response.info.position !== '')
				{
					$('#manageUserForm [name=editPosition]').val(response.info.position);
				}
			});
		}
	}
	
	function editAccountInfo()
	{
		var uname = null;
		var sat = null;
		var gradelevel = null;
		var section = null;
		var position = null;
		var level = null;
		var cluster = null;
		
		if ( !! document.getElementById('editUname')) uname = $('#manageUserForm [name=editUname]').val();
		if ( !! document.getElementById('editUserUserSubject')) sat = $('#manageUserForm [name=editUserUserSubject]').val();
		if ( !! document.getElementById('editUserGradelevel')) gradelevel = $('#manageUserForm [name=editUserGradelevel]').val();
		if ( !! document.getElementById('editUserSection')) section = $('#manageUserForm [name=editUserSection]').val();
		if ( !! document.getElementById('editPosition')) position = $('#manageUserForm [name=editPosition]').val();
		if ( !! document.getElementById('editUserLevel')) level = $('#manageUserForm [name=editUserLevel]').val();
		if ( !! document.getElementById('editUserCluster')) var cluster = $('#manageUserForm [name=editUserCluster]').val();
		
		var usertype = $('#manageUserForm [name=editUsertype]').val();
		var targetid = $('#manageUserForm [name=editTargetId]').val();
				
		var dataString = 'uname='+ uname + '&targetid='+ targetid + '&password='+ password
			+ '&usertype=' + usertype + '&sat=' + sat + '&gradelevel=' + gradelevel + '&section=' + section + '&position=' + position
			+ '&level=' + level + '&cluster=' + cluster;
		//console.log(dataString);
		$.ajax({
			type: "POST",
			url: "/app/edit_account",
			data: dataString,
			cache: false,
			success: function(result)
			{
				var result=trim(result);
				if(result=='correct')
				{
					location.reload();
				}
				else $("#status").html(result);
			}
		});
		return false;
	}
	
	function postResult()
	{
		var link = '/app/post_result';
		
		$.post(link,$("#evalform").serialize() ,function(response){
			if (response == 'correct')
			{
				window.location = "/app/score/"+ $('#evalform input[name=person]').val()+ "/" + $('#evalform input[name=semester]').val();
			}
			else 
			{	
				$('#status').html(response);
			}
		});
		
		return false;
	}
