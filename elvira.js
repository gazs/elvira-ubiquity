var elvira_url = "http://elvira.mav-start.hu/elvira.dll/xslms/uf";

CmdUtils.CreateCommand({
	names: ["elvira"],
	description: "Check Elvira timetable",
	help: "elvira (from) (to) (with via) (as student) (at [date])",
	icon: "http://elvira.mav-start.hu/xslms/res/favicon.ico",
	author: {name: "Gazs (piszkalta: KTamas)", email: "gazs@bergengocia.net (ktamas@ktamas.com)"},
	license: "GPL",
	arguments: [
		{
			role: "source",
			nountype: noun_arb_text,
			label: "origin"
		},
		{
			role: "goal",
			nountype: noun_arb_text,
			label: "destination"
		},
		{
			role: "instrument",
			nountype: noun_arb_text,
			label: "via"
		},
		{
			role: "alias",
			nountype: ["student"],
			label: "reduction" //izé, kedvezmény.
		},
		{
			role: "time",
			nountype: noun_type_date,
			label: "date of departure"
		}
	],
	elviraurl: function(arguments) {
		var source = escape(Utils.convertFromUnicode("ISO-8859-2", arguments.source.text));
		var goal = escape(Utils.convertFromUnicode("ISO-8859-2", arguments.goal.text));
		var via = escape(Utils.convertFromUnicode("ISO-8859-2", arguments.instrument.text));
		var datum = arguments.time.data.toString("yy.MM.dd");
		if (source.length >0 && goal.length >0) {
			switch (arguments.alias.text) {
				// TODO: többi kedvezmény.
				case "student":
					var u=1;
					break;
				default:
					var u=29;
					break;
			}
			return elvira_url + Utils.paramsToString({
					mikor: -1, 
					i: source, 
					e: goal, 
					d: datum, 
					u: u, // nem gazs nem jo ha default a student
					v: via
			});
		}
	},
	preview: function (pb, arguments) {
		pb.innerHTML = this.previewDefault();
		//karácsonyra igazán kérhetnétek utf8-at.
		$.ajaxSetup({'beforeSend' : function(xhr) {
			xhr.overrideMimeType('text/html; charset=ISO-8859-2');
			}
		});
		CmdUtils.previewGet(pb, this.elviraurl(arguments),
			function(page) {
				elvi = [];
				if ($("#searchtop > .box1 > .lboxbody1 > .xform > div:eq(4)", page).html() == "missing or misspelled station name") {
					pb.innerHTML = "misspelled station name?";
				} else {
					if ($("div#timetable > table > tbody > tr > td.noprint > div.jsubmit > form.jsubmit > input[type=submit]", page).length === 0) {
						pb.innerHTML = "no more trains on date.";
					} else {
						$("div#timetable > table > tbody > tr > td.noprint > div.jsubmit > form.jsubmit > input[type=submit]", page).each(function(i) {
							var basepath = $(this).parent().parent().parent().siblings();
					        var honnan = basepath.filter(".l:eq(0)").text();
					        var indul = basepath.filter(".l:eq(1)").text().trim();
					        var erkezik = basepath.filter(".l:eq(2)").text().trim();
					        var masodosztalyar = basepath.filter(".r:eq(2)").text().trim();
					        var rendeleslink = "https://jegyvasarlas.mav-start.hu/eTicketV2/Jegykivalasztas?" + $(this).parent().serialize();
							var reszletesdoboz = $(this).parent().parent().parent().parent().next().children().html(); // hogyan tudom ezt beformázni?
							elvi.push(_('<div id="${rendeleslink}">${honnan} - ${indul}-${erkezik} ${masodosztalyar} ${reszletesdoboz}</div>', //div id?? srsly??
							{rendeleslink: rendeleslink, honnan:honnan, indul:indul, erkezik:erkezik, masodosztalyar:masodosztalyar, reszletesdoboz:reszletesdoboz}));
						});
						CmdUtils.previewList(pb, elvi, function(id, ev) {
							Utils.focusUrlInBrowser($(elvi[id]).attr('id'));
						}, ".preview-list > li  .more {display:none}; .preview-list > li:hover .more {display:block};.preview-list li:hover {color:red}"); 
					}
				}
			},
			"xml"
		);
		return;  
	},

	execute: function (arguments) {
		Utils.focusUrlInBrowser(this.elviraurl(arguments));
		return;
	}
})