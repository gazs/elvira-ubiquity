CmdUtils.CreateCommand({
	names: ["elvira"],
	description: "Check Elvira timetable",
	help: "elvira (from) (to)",
	author: {name: "Gazs", email: "gazs@bergengocia.net"},
	license: "GPL",
	
	arguments: [
		{
			role: "source",
			nountype: noun_arb_text,
			label: "origin",
		},
		{
			role: "goal",
			nountype: noun_arb_text,
			label: "destination",
		},
		{
			role: "alias",
			nountype: noun_arb_text,
			label: "reduction", //izé, kedvezmény.
		},
	],
	preview: function (pb, arguments) {
		$.ajaxSetup({
		    'beforeSend' : function(xhr) {
	            xhr.overrideMimeType('text/html; charset=ISO-8859-2');
	    	    },
		});
		var source = escape(Utils.convertFromUnicode("ISO-8859-2", arguments.source.text));
		var goal = escape(Utils.convertFromUnicode("ISO-8859-2", arguments.goal.text));
		CmdUtils.log(arguments.alias.text);

		if (source.length >0 && goal.length >0) {
				switch (arguments.alias.text) {
					case "student":
						CmdUtils.log("hellostudent")
						var u=1;
						break;
					default:
						var u=29;
						break;
				}
			CmdUtils.log(u);
			jQuery.get('http://elvira.mav-start.hu/elvira.dll/xslms/uf?i='+ source +'&e=' + goal + '&sk=5&u=' + u, null, function (page) {
				CmdUtils.log("get");
				//$("#timetable > table > tbody > tr > .l").each(function(i) {displayMessage(i)})
				//pb.innerHTML = $("#timetable", page).html();
				
				var elviracska = ""
				$("div#timetable > table > tbody > tr > td.noprint > div.jsubmit > form.jsubmit > input[type=submit]", page).each(function(i) {
				        var honnan = $(this).parent().parent().parent().siblings().filter(".l:eq(0)").text().trim();
				        var indul = $(this).parent().parent().parent().siblings().filter(".l:eq(1)").text().trim();
				        var erkezik = $(this).parent().parent().parent().siblings().filter(".l:eq(2)").text().trim();
				        var masodosztalyar = $(this).parent().parent().parent().siblings().filter(".r:eq(2)").text().trim();
				        var rendeleslink = "https://jegyvasarlas.mav-start.hu/eTicketV2/Jegykivalasztas?" + $(this).parent().serialize();
					CmdUtils.log(honnan, indul, erkezik, masodosztalyar, rendeleslink);
					elviracska += '<li><a href="'+ rendeleslink +'">'+honnan+' - '+indul+'-'+erkezik+' : '+masodosztalyar+'</a></li>'
				})
				pb.innerHTML = elviracska;
			})
		}
		
		
		
		
		return;
	},
	execute: function( arguments ) {
		var source = escape(Utils.convertFromUnicode("ISO-8859-2", arguments.source.text));
		var goal = escape(Utils.convertFromUnicode("ISO-8859-2", arguments.goal.text));
		Utils.openUrlInBrowser("http://elvira.mav-start.hu/elvira.dll/xslms/uf?i="+ source +"&e=" + goal)

		return;
	}
})
