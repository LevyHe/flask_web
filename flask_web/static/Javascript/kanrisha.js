/* 
	Kanrisha: A Premium HTML5 Responsive Admin Template
	COPYRIGHT Â© 2012 Mahieddine Abd-kader (@mitgux)
*/

var kanrisha_method = {
	
	showTooltip: function (x, y, contents) {
		$('<div class="charts_tooltip">' + contents + '</div>').css( {
			position: 'absolute',
			display: 'none',
			top: y + 5,
			left: x + 5
		}).appendTo("body").fadeIn('fast');
	},

}

var km = kanrisha_method;

// Document Ready and the fun begin :) 
$(function () {

/* Change Pattern ==================================== */

	$(".changePattern span").on("click", function(){
		var id = $(this).attr("id");
		$("body").css("background-image", "url('../Images/Textures/"+ id +".png')");
	});

/* Opera Fix ========================================= */

	if ( $.browser['opera'] ) {
		$("aside").addClass('onlyOpera');
	}

/* Charts ============================================ */
	
	if (!!$(".charts").offset() ) {
		var sin = [];
		var cos = [];

		for (var i = 0; i <= 20; i += 0.5){
			sin.push([i, Math.sin(i)]);
			cos.push([i, Math.cos(i)]);
		}

		// Display the Sin and Cos Functions
		$.plot($(".charts"), [ { label: "Cos", data: cos }, { label: "Sin", data: sin } ],
			{
				colors: ["#00AADD", "#FF6347"],

				series: {
					lines: {
							show: true,
							lineWidth: 2,
						   },
					points: {show: true},
					shadowSize: 2,
				},

				grid: {
					hoverable: true,
					show: true,
					borderWidth: 0,
					tickColor: "#d2d2d2",
					labelMargin: 12,
				},

				legend: {
					show: true,
					margin: [0,-24],
					noColumns: 0,
					labelBoxBorderColor: null,
				},

				yaxis: { min: -1.2, max: 1.2},
				xaxis: {},
			});

		// Tooltip Show
		var previousPoint = null;
		$(".charts").bind("plothover", function (event, pos, item) {
			if (item) {
				if (previousPoint != item.dataIndex) {
					previousPoint = item.dataIndex;
					$(".charts_tooltip").fadeOut("fast").promise().done(function(){
						$(this).remove();
					});
					var x = item.datapoint[0].toFixed(2),
						y = item.datapoint[1].toFixed(2);
					km.showTooltip(item.pageX, item.pageY, item.series.label + " of " + x + " = " + y);
				}
			}
			else {
				$(".charts_tooltip").fadeOut("fast").promise().done(function(){
					$(this).remove();
				});
				previousPoint = null;
			}
		});

		if (!!$(".v_bars").offset() && !!$(".h_bars").offset() && !!$(".realtime_charts").offset()) {
			// Display Some Vertican bars
			$.plot($(".v_bars"), [ { data: [ [00,20], [20,50], [40,90], [60,30], [80,80], [100,60]] }, { data: [ [10,30], [30,80], [50,50], [70,10], [90,70] ] } ],
				{
					colors: ["#F7810C", "#E82E36"],

					series: {
						lines: {
								show: false,
								lineWidth: 2,
							   },
						points: {show: false},
						shadowSize: 2,
						bars: {
							show: true,
							barWidth: 3,
							lineWidth: 1,
							fill: 0.8,
						}
					},

					grid: {
						hoverable: false,
						show: true,
						borderWidth: 0,
						tickColor: "#d2d2d2",
						labelMargin: 12,
					},

					legend: {
						show: false,
					},

					yaxis: { min: 0, max: 100},
					xaxis: { min: 0, max: 105},
				});

			// Display Some Vertical bars
			$.plot($(".h_bars"), [ { data: [ [20,20], [20,50], [40,00], [60,30], [80,80], [100,70]] }, { data: [ [10,10], [30,100], [50,40], [70,90], [90,60] ] } ],
				{
					colors: ["#F7810C", "#E82E36"],

					series: {
						lines: {
								show: false,
								lineWidth: 2,
							   },
						points: {show: false},
						shadowSize: 2,
						bars: {
							show: true,
							barWidth: 3,
							lineWidth: 1,
							fill: 0.8,
							horizontal: true,
						}
					},

					grid: {
						hoverable: false,
						show: true,
						borderWidth: 0,
						tickColor: "#d2d2d2",
						labelMargin: 12,
					},

					legend: {
						show: false,
					},

					yaxis: { min: 0, max: 100},
					xaxis: { min: 0, max: 105},
				});

			// Display the realtime Charts
			// Generate a random data
			var data = [], totalPoints = 300;
			function  getRandomData () {
				if (data.length > 0)
					data = data.slice(1);
				// do a random walk
				while (data.length < totalPoints) {
					var prev = data.length > 0 ? data[data.length - 1] : 50;
					var y = prev + Math.random() * 10 - 5;
					if (y < 0)
						y = 0;
					if (y > 100)
					y = 100;
					data.push(y);
				}
				// zip the generated y values with the x values
				var res = [];
				for (var i = 0; i < data.length; ++i)
					res.push([i, data[i]])
				return res;
			}
			var realtime = $.plot($(".realtime_charts"), [ getRandomData() ],
				{
					colors: ["#00AADD"],

					series: {
						lines: {
								show: true,
								lineWidth: 2,
								fill: 0.65,
							   },
						points: {show: false},
						shadowSize: 2,
					},

					grid: {
						show: true,
						borderWidth: 0,
						tickColor: "#d2d2d2",
						labelMargin: 12,
					},

					legend: {
						show: false,
					},

					yaxis: { min: 0, max: 105},
					xaxis: { min: 0, max: 250},
				}	
			);
			function realtime_function() {
				realtime.setData([ getRandomData() ]);
				realtime.draw();
				setTimeout(realtime_function, 700);
			}
			realtime_function();
		}
	}

	// Pie Charts
	if(!!$(".pie_charts").offset()){
		$.plot($(".pie_charts"), [ { label: "iOS", data: 50 }, { label: "Android", data: 40 }, { label: "Windows", data: 30 }],
			{
				colors: ["#F7810C", "#00AADD", "#E82E36"],

				series: {
					pie: {
		                show: true,
		                tilt: 0.6,
		                label: {
	                    	show: true,
	                	}
		            },
				},

				grid: {
					show: false,
				},

				legend: {
					show: true,
					margin: [0,-24],
					noColumns: 1,
					labelBoxBorderColor: null,
				},
			});

		// Donut Charts
		if(!!$(".donut_charts").offset()){
			$.plot($(".donut_charts"), [ { label: "iOS", data: 50 }, { label: "Android", data: 40 }, { label: "Windows", data: 30 }],
			{
				colors: ["#00AADD", "#F7810C", "#E82E36"],

				series: {
					pie: {
		                show: true,
		                innerRadius: 0.4,
		            },
				},

				grid: {
					show: false,
				},

				legend: {
					show: true,
					margin: [0,-24],
					noColumns: 1,
					labelBoxBorderColor: null,
				},
			});
		}
	}
	
/* Tables ============================================ */
	// Set the DataTables
	$("table.datatables").dataTable({
       // "sDom": "<'dtTop'<'dtShowPer'l><'dtFilter'f>><'dtTables't><'dtBottom'<'dtInfo'i><'dtPagination'p>>",
       "sDom": "<'dtTop'<'dtFilter'f>><'dtTables't><'dtBottom'<'dtInfo'i>>",
        "oLanguage": {
            "sLengthMenu": "每页条数 _MENU_",
            "sInfoEmpty": "没有数据",  
            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据", 
            "oPaginate": {  
				"sFirst": "首页",  
				"sPrevious": "前一页",  
				"sNext": "后一页",  
				"sLast": "尾页" 
				},  
				"sZeroRecords": "没有检索到数据",  
        },
         "bStateSave" : true,				//保存操作状态
         "aLengthMenu" : [20, 50, 100], //更改显示记录数选项  
         "iDisplayLength" : 100, //默认显示的记录数  
         "bAutoWidth" : true, //是否自适应宽度  
         "bLengthChange": false, 
         "bScrollCollapse" : false,
         "bPaginate": false,//是否分页
        //"sPaginationType": "full_numbers",
        "fnInitComplete": function(){
        	$(".dtShowPer select").uniform();
        	$(".dtFilter input").addClass("simple_field").css({
        		"width": "auto",
        		"margin-left": "15px",
        	});
        }
	
    });
    
    $("table.deletetables").dataTable(
    	{
    		"sDom": "<'dtTop1'<'dtFilter1'f>><'dtTables1't>",
			bAutoWidth: false, //是否自动计算表格各列宽度
			bPaginate: false, //是否显示使用分页
			bInfo: false, //是否显示页数信息
			//sPaginationType: "full_numbers", //分页样式,底部页码选择样式
			bFilter: true, //是否显示搜索框
			bSort: false, //是否允许排序
			serverSide: true, //是否从服务器获取数据
			bStateSave: false, //页面重载后保持当前页状态
			bLengthChange: false, //是否显示每页大小的下拉框
			//sServerMethod: "POST",
			bScrollInfinite:true,
			bScrollCollapse:true,
			bPaginate: false,
			sScrollY:"400px",
			"fnInitComplete": function() {
				$(".dtFilter1 input").addClass("simple_field").css({
					"width": "auto",
					"margin-left": "15px",
				});
			}
    });
    
    $('.datatables > tbody').on( 'click', 'tr', function () {
    	
    	var local_table=$(this).closest('.datatables')
    	
       if ( $(this).hasClass('dTselected') ) {
           $(this).removeClass('dTselected');
       }
       else {
           local_table.find('tr.dTselected').removeClass('dTselected');
           $(this).addClass('dTselected');
       }
    } );

	// Table Resize-able
	$(".resizeable_tables").colResizable({
		liveDrag: true,
		minWidth: 40,
	});

	// Table with Tabs
	$( "#table_wTabs" ).tabs();
	
	// Check All Checkbox
	$(".tMainC").click(function(){
		var checked = $(this).prop("checked");
		var parent = $(this).closest(".twCheckbox");

		parent.find(".checker").each(function(){
			if (checked){
				$(this).find("span").addClass("checked");
				$(this).find("input").prop("checked", true);
			}else{
				$(this).find("span").removeClass("checked");
				$(this).find("input").prop("checked", false);
			}
		});
		$(".deletetables").find('tbody').find('tr').each(function(){
			var ischeck=$(this).find("input").prop("checked");
			if(ischeck)
			{
				$(this).addClass('dTchecked');
			}else
			{
				$(this).removeClass('dTchecked');
			}
		});
	});

	$(".deletetables").find('tbody').find('tr').on('click',function(){
		var ischeck=$(this).find("input").prop("checked");
		if(ischeck)
		{
			$(this).addClass('dTchecked');
		}else
		{
			$(this).removeClass('dTchecked');
		}
		
	});

/* Forms ============================================= */
	$(".simple_form").uniform(); // Style The Checkbox and Radio
	$(".elastic").elastic();
	$(".twMaxChars").supertextarea({
	   	maxl: 140
	});

/* Spinner =========================================== */
	$(".spinner1").spinner();
	$(".spinner2").spinner({
		min: 0,
		max: 30,
	});
	$(".spinner3").spinner({
		min: 0,
		prefix: '$',
	});
	$(".spinner4").spinner().spinner("disable");
	$(".spinner5").spinner({'step':5});

/* ToolTip & ColorPicker & DatePicker ================ */
	$(".tooltip").tipsy({trigger: 'focus', gravity: 's', fade: true});
	$("#btTop").tipsy({gravity: 's'});
	$("#btTopF").tipsy({gravity: 's',fade: true});
	$("#btTopD").tipsy({gravity: 's',delayOut: 2000});
	$("#btLeft").tipsy({gravity: 'e'});
	$("#btRight").tipsy({gravity: 'w'});
	$("#btBottom").tipsy({gravity: 'n'});

	$(".fwColorpicker").ColorPicker({
		onSubmit: function(hsb, hex, rgb, el) {
			$(el).val(hex);
			$(el).ColorPickerHide();
		},
		onBeforeShow: function () {
			$(this).ColorPickerSetColor(this.value);
		},
	})
	.bind('keyup', function(){
		$(this).ColorPickerSetColor(this.value);
	});	
	function getNowFormatDate() {
		var date = new Date();
		var seperator1 = "-";
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if(month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if(strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = year + seperator1 + month + seperator1 + strDate;
		return currentdate;
	}
	Date.prototype.Format = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	};
	$(".pick_date").val(getNowFormatDate());
	$("#his_end_time_id").val(new Date().Format("hh:mm"));
	
	$( ".pick_date" ).datepicker(
		{
            dateFormat: 'yy-mm-dd',//日期格式  
            yearSuffix: '年', //年的后缀  
			monthNames:[
			"1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"
			],
			dayNamesMin:["日","一","二","三","四","五","六"],
			showMonthAfterYear:1,
			firstDay:1,
			prevText: "<<",
			nextText: ">>",
		}
	);

/* Masked Input & AutoComplet ======================== */
var options =  { 
    onChange: function(cep, event, currentField, options){
        if(cep){
            var ipArray = cep.split(".");
            for (i in ipArray){
                if(ipArray[i] != "" && parseInt(ipArray[i]) > 255){
                    ipArray[i] =  '255';
                }
            }
            var resultingValue = ipArray.join(".");
            $(currentField).val(resultingValue);
        }
    }
};
	$(".phone_mask").mask("(999) 999-9999");
	$(".date_mask").mask("9999/99/99");
	$(".tagname_mask").on("keyup",function(){
		var tag=this.value;
	  	reg = /^_*[a-zA-Z]\w*((\[([1-9]\d{0,2}|0)\]){0,1})(.(_*[a-zA-Z]\w*((\[([1-9]\d{0,2}|0)\]){0,1})))*(.([1-9]\d{0,1}|0)|)$/;
	  	if(tag=="")
	  	{
	  		var test=$(this).next()[0];
	  		test.innerHTML="请输入不超过30个字符";
			test.classList.remove('warn_color');
	  		return;
	  	}
		if(reg.test(tag)){
			var test=$(this).next()[0];
			test.innerHTML="";
			test.classList.remove('warn_color');
		}else{
			var test=$(this).next()[0];
			test.innerHTML="标签名不合法";
			test.classList.add('warn_color');
		}
	});
	var availableTags = [
			"ActionScript",
			"AppleScript",
			"Asp",
			"BASIC",
			"C",
			"C++",
			"Clojure",
			"COBOL",
			"ColdFusion",
			"Erlang",
			"Fortran",
			"Groovy",
			"Haskell",
			"Java",
			"JavaScript",
			"Lisp",
			"Perl",
			"PHP",
			"Python",
			"Ruby",
			"Scala",
			"Scheme"
		];
	$( ".atC" ).autocomplete({
			source: availableTags
		});

/* Wysiwyg =========================================== */
	
	$(".wysiwyg").cleditor({width:"100%", height:"100%"});

/* Calendar ========================================== */
	// Get Date
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear(); 

	$(".aCalendar").fullCalendar({
	    header: {
			left: 'prev',
			center: 'title',
			right: 'next'
		},
		editable: true,
		events: [
		{
			title: 'This is an Event',
			start: new Date(y, m, 4),
			end: new Date(y, m, 6)
		},
		{
			id: 999,
			title: 'A Task',
			start: new Date(y, m, 4, 10, 30),
			allDay: false,
		},
		{
			title: 'Today Event',
			start: new Date(y, m, d)
		},
		{
			title: 'Guys Meeting',
			start: new Date(y, m, 14),
		},
		{
			title: 'CSS Conferences',
			start: new Date(y, m, 23),
			end: new Date(y, m, 25),
		},
	]});

/* Slider ============================================ */
	$(".sSimple").slider();

	$(".swMin").slider({
		range: "min",
		value: 80,
		min: 1,
		max: 700,
		slide: function( event, ui ) {
			$( ".swmLabel" ).html( "$" + ui.value );
		}
	});

	$(".swMin-1").slider({
		range: "min",
		value: 120,
		min: 1,
		max: 700,
		slide: function( event, ui ) {
			$( ".swmLabel" ).html( "$" + ui.value );
		}
	});

	$(".swMin-2").slider({
		range: "min",
		value: 220,
		min: 1,
		max: 700,
		slide: function( event, ui ) {
			$( ".swmLabel" ).html( "$" + ui.value );
		}
	});

	$(".swMin-3").slider({
		range: "min",
		value: 350,
		min: 1,
		max: 700,
		slide: function( event, ui ) {
			$( ".swmLabel" ).html( "$" + ui.value );
		}
	});

	$(".swMin-4").slider({
		range: "min",
		value: 450,
		min: 1,
		max: 700,
		slide: function( event, ui ) {
			$( ".swmLabel" ).html( "$" + ui.value );
		}
	});

	$(".swMin-5").slider({
		range: "min",
		value: 600,
		min: 1,
		max: 700,
		slide: function( event, ui ) {
			$( ".swmLabel" ).html( "$" + ui.value );
		}
	});

	$(".swMax").slider({
		range: "max",
		value: 600,
		min: 1,
		max: 700,
		slide: function( event, ui ) {
			$( ".swnLabel" ).html( "$" + ui.value );
		}
	});

	$( ".swRange" ).slider({
		range: true,
		min: 0,
		max: 500,
		values: [ 75, 300 ],
		slide: function( event, ui ) {
			$( ".swrLabel" ).html( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
		}
	});

	$( "#swVer-1" ).slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		value: 60,
	});

	$( "#swVer-2" ).slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		value: 40,
	});

	$( "#swVer-3" ).slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		value: 30,
	});

	$( "#swVer-4" ).slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		value: 15,
	});

	$( "#swVer-5" ).slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		value: 40,
	});

	$( "#swVer-6" ).slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		value: 80,
	});

/* Progress ========================================== */
	
	$(".sProgress").progressbar({
		value: 40
	});

	$(".pwAnimate").progressbar({
		value: 1,
		create: function() {
			$(".pwAnimate .ui-progressbar-value").animate({"width":"100%"},{
				duration: 10000,
				step: function(now){
					$(".paValue").html(parseInt(now)+"%");
				},
				easing: "linear"
			})
		}
	});

	$(".pwuAnimate").progressbar({
		value: 1,
		create: function() {
			$(".pwuAnimate .ui-progressbar-value").animate({"width":"100%"},{
				duration: 30000,
				easing: 'linear',
				step: function(now){
					$(".pauValue").html(parseInt(now*10.24)+" Mb");
				},
				complete: function(){
					$(".pwuAnimate + .field_notice").html("<span class='must'>Upload Finished</span>");
				} 
			})
		}
	});

/* Tab Toggle ======================================== */
	
	$(".cwhToggle").click(function(){
		// Get Height
		var wC = $(this).parents().eq(0).find('.widget_contents');
		var wH = $(this).find('.widget_header_title');
		var h = wC.height();

		if (h == 0) {
			wH.addClass("i_16_downT").removeClass("i_16_cHorizontal");
			wC.css('height','auto').removeClass('noPadding');
		}else{
			wH.addClass("i_16_cHorizontal").removeClass("i_16_downT");
			wC.css('height','0').addClass('noPadding');
		}
	})

/* Dialog ============================================ */
	
	$.fx.speeds._default = 400; // Adjust the dialog animation speed

	$(".bDialog").dialog({
		autoOpen: false,
		show: "fadeIn",
		modal: true,
	});

	$(".dConf").dialog({
		autoOpen: false,
		show: "fadeIn",
		modal: true,
		buttons: {
			"Yeah!": function() {
				$( this ).dialog( "close" );
			},
			"Never": function() {
				$( this ).dialog( "close" );
			}
		}
	});

	$(".bdC").live("click", function(){ /* change click to live */
		$(".bDialog").dialog( "open" );
		return false;
	});

	$(".bdcC").live("click", function(){ /* change click to live */
		$(".dConf").dialog( "open" );
		return false;
	});

/* LightBox ========================================== */
	
	$('.lPreview a.lightbox').colorbox({rel:'gal'});

/* Drop Menu ========================================= */
	
	$(".drop_menu").parent().on("click", function(){
		var status = $(this).find(".drop_menu").css("display");
		if (status == "block"){
			$(this).find(".drop_menu").css("display", "none");
		}else{
			$(this).find(".drop_menu").css("display", "block");
		}
	});

	$(".top_tooltip").parent().on("hover", function(){
		var status = $(this).find(".top_tooltip").css("display");
		if (status == "block"){
			$(this).find(".top_tooltip").css("display", "none");
		}else{
			$(this).find(".top_tooltip").css("display", "block");
		}
	});
	$(".hover_drop_menu").parent().on("hover", function(){
		var status = $(this).find(".hover_drop_menu").css("display");
		if (status == "block"){
			$(this).find(".hover_drop_menu").css("display", "none");
		}else{
			$(this).find(".hover_drop_menu").css("display", "block");
		}
	});

/* Inline Dialog ===================================== */

	$(".iDialog").on("click", function(){
		$(this).fadeOut("slow").promise().done(function(){
			$(this).parent().remove();
		});
	});
/*New Tag Dialog ======================================*/	

	$("#new-tag-dialog").dialog({
		autoOpen:false,
		width: 500,
		modal: true,
		close: function(){
			var temp = $('#new_tag_title_msg');
			temp.removeClass('warn_color');
			temp.text('标签名首字母必须为字母（a-z，A-Z)、下划线(_)开始,标签名必须是字母（a-z A-Z）、数字（0-9）、下划线（_）的组合。');	
			$("#new-tag-dialog").find('input[type=text]').val("");		
			if($(this).hasClass('is_add_new_tag_flag'))
			{
				location.reload();
			}
		},
	});
	$("#import-tag-dialog").dialog({
	
		autoOpen:false,
		width: 500,
		modal: true,
		close: function() {
			
			var files = $('#tag_import_file_id').prop('files');
			if(files.length != 0)
			{
				$('#tag_import_file_id').val('');
				var tab=$('#import_tags_div');
				$('#import_tags_div').html('<table class="importtables tables"> </table>');				
			}
			
		},
	});
	
	$("#delete-tag-dialog").dialog({
	
		autoOpen:false,
		width: 500,
		height: 800,
		modal: true,
	});
	$("#device_manage_dialog").dialog({
	
		autoOpen: false,
		width: 500,
		height: 800,
		modal: true,
	});
	
	 $("#delete-tag-dialog").find('table').on( 'click', 'tr', function () {
    	
    	var local_table=$(this).closest('table')
    	
       if ( $(this).hasClass('selected') ) {
           $(this).removeClass('selected');
       }
       else {
           local_table.find('tr.selected').removeClass('selected');
           $(this).addClass('selected');
       }
    } );
	$('#tag_import_file_id').on('change',function(){
		var files=$(this).prop('files');
		if(files.length==0)
			return;
		if( typeof(FileReader) !== 'undefined' ){    //H5
			var reader = new FileReader();
			reader.readAsText(files[0], "UTF-8");
		  	reader.onload = function(evt){ //读取完文件之后会回来这里
				var fileString = evt.target.result;
				var a = new CSV(fileString, {
	            header: ['tagname', 'tagshortdesc', 'tagdesc']
	          }).parse();
	          if(a.length>0)
	          {
		          a.pop();
		          $('#import_tags_div').html('<table class="importtables tables"> </table>');
		          var tab=$('.importtables');	       	
		          make_json_table(tab,['标签名','标签功能','标签描述'],a);
		          var a_str = JSON.stringify(a); 
		          sessionStorage.import_taglist=a_str;
		          
	          }else
	          {
	          	$('#import_tags_div').html('<table class="importtables tables"> </table>');
		        var tab=$('.importtables');	       	
		        make_json_table(tab,['标签名','标签功能','标签描述'],[]);
	          }
	        }
	    }else{
	        alert("IE9及以下浏览器不支持，请使用Chrome或Firefox浏览器");
	    }
	});
	
	
	
	function add_message_dialog(_id_,_title,message,reload=false)
	{
		$('body').append('<div class="dialog_message" id="' + _id_ +
		'"><div class="widget_contents Padding "></div>'+
		'<div class="line_grid"><div class="label">' + message + 
		'</div></div></div>');
		$("#" + _id_).dialog({
			title: _title,
			width: 300,
			modal: true,
			autoOpen: true,
			buttons: {
				Ok: function() {
					if(reload)
					{
						location.reload();
					}
					$(this).dialog("close");
				}
			},
			close: function() {
				$("#" + _id_).dialog("distory");
			}
		});
	};
	function make_json_table(tab,objColumn,objData)
	{
		//var pant=tab.parent();
		//tab.dataTable().fnDestroy();
		 var sHtml = "";
		 sHtml += "<thead>";		 
		 var sTrHtml = "<tr>";
		 $.each(objColumn, function(i) {
		 
		 	sTrHtml += "<th ";
		 	sTrHtml += ">";
		 	sTrHtml += objColumn[i];
		 	sTrHtml += "</th>";		 
		 });
		 sTrHtml += "</tr>";
		 sHtml += sTrHtml + "</thead>";		 
		 sHtml += "<tbody>";
		 
		 $.each(objData, function(i) {
		 	sTrHtml = "<tr>";
		 	var objTr = objData[i];
		 	for(x in objTr) {
		 		sTrHtml += "<td>"
		 		sTrHtml += objTr[x];
		 		sTrHtml += "</td>";
		 	}
		 	sTrHtml += "</tr>";
		 	sHtml += sTrHtml;
		 });		 
		 sHtml += "</tbody>";
		 tab.append(sHtml);
		 tab.dataTable({
		 	bAutoWidth: false, //是否自动计算表格各列宽度
		 	bPaginate: false, //是否显示使用分页
		 	bInfo: false, //是否显示页数信息
		 	//sPaginationType: "full_numbers", //分页样式,底部页码选择样式
		 	bFilter: false, //是否显示搜索框
		 	bSort: false, //是否允许排序
		 	serverSide: false, //是否从服务器获取数据
		 	bStateSave: false, //页面重载后保持当前页状态
		 	bLengthChange: false, //是否显示每页大小的下拉框
		 	//sServerMethod: "POST",
		 	bScrollInfinite: true,
		 	bScrollCollapse: true,
		 	bPaginate: false,
		 	bDestroy:true,
		 	sScrollY: "400px",
		 	sScrollY: "600px",
		 });
	};
	
	$(".new-tag-button").on("click",function () {
		$("#new-tag-dialog").dialog("open");
	});
	$(".import_tag_button").on("click",function () {
		$("#import-tag-dialog").dialog("open");
		sessionStorage.import_taglist="";
	});	
	$(".delete_tag_button").on("click",function () {
		$("#delete-tag-dialog").dialog("open");
	});	
	$(".device_manage_btn").on("click", function() {
		$("#device_manage_dialog").dialog("open");
	});
	$(".cancel_buttons").on("click",function () {
		$(".dialog").dialog("close");
	});



	$(".add_new_tag_form").on("submit",function(){
	    var tag=$(this).find(".tagname_mask")[0].value;	    
	  	reg = /^_*[a-zA-Z]\w*((\[([1-9]\d{0,2}|0)\]){0,1})(.(_*[a-zA-Z]\w*((\[([1-9]\d{0,2}|0)\]){0,1})))*(.([1-9]\d{0,1}|0)|)$/;
		if(!reg.test(tag)){
			return false;
		}
		$.post($ADD_NEW_TAG_URL,$(this).serialize(),function(data){
//		$('#new-tag-dialog').fing(".errorlogin").innerHTML='<strong>Error:</strong>'+data.error;
		var temp = $('#new_tag_title_msg');
		if(data.error){
			temp.text(data.error);
			temp.addClass('warn_color');
		}else{
			temp.removeClass('warn_color');
//			$("#new-tag-dialog").dialog("reset");
//			$("#new-tag-dialog").dialog("close");
			temp.text('标签名首字母必须为字母（a-z，A-Z)、下划线(_)开始,标签名必须是字母（a-z A-Z）、数字（0-9）、下划线（_）的组合。');
			add_message_dialog('add_new_tag_ok','提示','成功添加了一条新的标签！');
			//$("#new-tag-dialog").find('input[type=text]').val("");
			if(!$('#new-tag-dialog').hasClass('is_add_new_tag_flag'))
			{
				$('#new-tag-dialog').addClass('is_add_new_tag_flag')
			}
		}
      });
		return false;
	});
	$(".delete_tags_form").on("submit", function() {
		var a = [];
		$(this).find('table').find('tr.dTchecked').each(function(){
			var tag = this.cells[1];
			a.push(tag.outerText);						
		});
		if(a.length==0)
		{
			add_message_dialog('delete_tag_error','提示','没有选择要删除的标签！');
			return false;
		}
		$.post($DELTET_TAGS_URL, {"taglist":a}, function(data) {
			//		$('#new-tag-dialog').fing(".errorlogin").innerHTML='<strong>Error:</strong>'+data.error;
			if(data.error)
			{
				add_message_dialog('delete_tag_error','提示',data.error);				
			}else
			{
				add_message_dialog('delete_tag_error','提示','已经成功删除选中的标签',true);
			}
		});
		return false;
	});

	$(".import_tags_form").on("submit", function() {
		var a;
		if(sessionStorage.import_taglist)
		{
			a=JSON.parse(sessionStorage.import_taglist)
		}else
		{
			add_message_dialog('import_tags_error', '提示', '不存在标签数据');
			return false;
		}
		$.post($IMPORT_TAGS_URL, {"taglist":sessionStorage.import_taglist}, function(data) {
			//		$('#new-tag-dialog').fing(".errorlogin").innerHTML='<strong>Error:</strong>'+data.error;
			var _mess='导入标签结果如下：\n'
			_mess +=data.a_str+'\n'+data.r_str;			
			add_message_dialog('delete_tag_error','提示',_mess,true);
		});
		return false;
	});
	$(".device_manage_form").on("submit", function() {

		$.post($DEVICE_MANAGE_URL, $(this).serialize(), function(data) {
	
			if(data.error)
			{
				add_message_dialog('device_manage_error','提示',data.error);
			}else
			{
				add_message_dialog('device_manage_error','提示','设备信息修改成功！',true);
			}
		});
		return false;
	});
	
	$('#user_manage_table > tbody').on('click', 'tr', function() {
	
		if($('#add_user_cancel_tn').length >0)
		{
			return;
		}
		var local_table = $(this).closest('#user_manage_table')
		
		if($(this).hasClass('dTselected')) {
			$(this).removeClass('dTselected');
			$('#uer_manage_form').html("");
		} else {
			local_table.find('tr.dTselected').removeClass('dTselected');
			$(this).addClass('dTselected');
			var vhtml="";
			vhtml+='<div class="line_grid"><div class="g_3"><span class="label">用户名：</span></div><div class="g_9">';
			vhtml+='<input class="simple_field" title="user name" value="'+this.cells[1].innerHTML+'"name="old_name" type="text" readonly="true">';
			vhtml+='</div></div>';
			vhtml+='<div class="line_grid"><div class="g_3"><span class="label">新密码：</span></div><div class="g_9">';
			vhtml+='<input class="simple_field" title="new passwd" value="" placeholder="************" name="new_passwd" type="password" >';
			vhtml+='</div></div>';
			vhtml += '<div class="line_grid"><div class="g_3"><span class="label">密码确认：</span></div><div class="g_9">';
			vhtml += '<input class="simple_field" title="repeat passwd" value="" placeholder="************" name="new_passwd_r" type="password" >';
			vhtml += '</div></div>';
			
			vhtml+='<div class="line_grid"><div class="g_3"><span class="label">用户权限：</span></div><div class="g_9">';
			vhtml+='<select class="simple_form" name="user_level">';
			vhtml+='<option value=0 title="默认用户类型">默认用户类型</option>';
			vhtml+='<option value=1 title="普通用戶"';
			if(this.cells[2].innerHTML=='普通用户')	
			{
				vhtml+='selected="selected"';
			}
			vhtml+='>普通用戶</option>';
			vhtml+='<option value=2 title="管理员"';
			if(this.cells[2].innerHTML=='管理员'){
				vhtml+='selected="selected"';
			}
			vhtml+='>管理员</option>';
			vhtml += '<option value=3 title="超级管理员"';
			if(this.cells[2].innerHTML == '超级管理员') {
				vhtml += 'selected="selected"';
			}
			vhtml += '>超级管理员</option>';
			vhtml +='</select></div></div>';
			vhtml +='<div class="line_grid"><div class="g_100">';
			vhtml +='<div><span><input type="submit" value="修改" class="submitIt simple_buttons" /></span></div>';
			vhtml +='<div><span><input type="button" value="删除" class="submitIt cancel_buttons" id="delete_user_btn" /></span></div>';
			vhtml +='</div></div>';
			$('#uer_manage_form').html(vhtml);			
			$('#uer_manage_form').find(".simple_form").uniform(); 	
			$('#uer_manage_form').find("#delete_user_btn").click(function() {
				var del_user=$('#uer_manage_form').find('input[name="old_name"]').val();
				$.post($USER_MANAGE_URL, {"del_user":del_user}, function(data) {
				
					if(data.error!=null) {
						add_message_dialog('delete_user_error', '提示', data.error);
					} else if(data.mess!=null) {
						add_message_dialog('delete_user_ok', '提示',data.mess, true);
					}else
					{
						add_message_dialog('delete_user_error', '提示', "未知错误");
					}
				});
			});

			$("#uer_manage_form").find('input[name="new_passwd"]').on('input', function() {
				var rpasswd = $("#uer_manage_form").find('input[name="new_passwd_r"]');
				if($(this).val().length==0)
				{
					this.setCustomValidity("");
					if(rpasswd.val().length==0)
					{
						rpasswd[0].setCustomValidity("");
					}
					return;
				}
				if($(this).val().length < 2 ) {
					this.setCustomValidity("密码太短了，^(*￣(oo)￣)^！");
				} else {
					{
						if(rpasswd.val().length>0 && $(this).val() != rpasswd.val()) {
							rpasswd[0].setCustomValidity("o(╥﹏╥)o，两次输入密码不一样");
						} else {
							rpasswd[0].setCustomValidity("");
						}
					}
					this.setCustomValidity("");
				}
			});
			$("#uer_manage_form").find('input[name="new_passwd_r"]').on('input', function() {
				var passwd = $("#uer_manage_form").find('input[name="new_passwd"]');
				if(passwd.val().length==0)
				{
					this.setCustomValidity("");
					return;
				}
				
				if($(this).val() != passwd.val()) {
					this.setCustomValidity("o(╥﹏╥)o，两次输入密码不一样");
				} else {
					this.setCustomValidity("");
				}
			
			});			
			$("#uer_manage_form").on("submit", function() {
				$(this).find('.field_notice').remove();	

				$.post($USER_MANAGE_URL, $(this).serialize(), function(data) {
					var fhtml = "";
					if(data.err_type == null) {
						add_message_dialog('change_user_error', '提示', '修改用户信息未知错误');
					} else if(data.err_type == 0) {
						add_message_dialog('change_user_ok', '提示', data.error, true);
					} else {
						add_message_dialog('change_user_error', '提示', data.error);
					}
				});
			
				return false;
			});
		}
	});
	$(".add_user_btn").on("click",function() {
		var trhtml ='<tr><td></td><td>newuser1</td><td>普通用户</td></tr>'	;
		$('#user_manage_table').find('tr.dTselected').removeClass('dTselected');
		$("#user_manage_table tr:last").after(trhtml);
		$("#user_manage_table tr:last").addClass('dTselected')
		var vhtml = "";
		vhtml += '<div class="line_grid"><div class="g_3"><span class="label">用户名：</span></div><div class="g_9">';
		vhtml += '<input class="simple_field" title="user name" value="newuser1" name="new_user" type="text" required>';
		vhtml += '</div></div>';
		vhtml += '<div class="line_grid"><div class="g_3"><span class="label">新密码：</span></div><div class="g_9">';
		vhtml += '<input class="simple_field" title="user name" value="" placeholder="************" name="passwd" type="password" required>';
		vhtml += '</div></div>';
		vhtml += '<div class="line_grid"><div class="g_3"><span class="label">密码确认：</span></div><div class="g_9">';
		vhtml += '<input class="simple_field" title="user name" value="" placeholder="************" name="r_passwd" type="password" required>';
		vhtml += '</div></div>';
		
		vhtml += '<div class="line_grid"><div class="g_3"><span class="label">用户权限：</span></div><div class="g_9">';
		vhtml += '<select class="simple_form" name="user_level">';
		vhtml += '<option value=0 title="默认用户类型">默认用户类型</option>';
		vhtml += '<option value=1 title="普通用戶" selected="selected">普通用戶</option>';
		vhtml += '<option value=2 title="管理员">管理员</option>';
		vhtml += '<option value=3 title="超级管理员">超级管理员</option>';
		vhtml += '</select></div></div>';
		vhtml += '<div class="line_grid"><div class="g_100">';
		vhtml += '<div><span><input type="submit" value="添加" class="submitIt simple_buttons" /></span></div>';
		vhtml += '<div><span><input type="button" value="取消" class="submitIt cancel_buttons" id="add_user_cancel_tn"/></span></div>';
		vhtml += '</div></div>';
		$('#uer_manage_form').html(vhtml);
		$('#uer_manage_form').find(".simple_form").uniform();
		$('#uer_manage_form').find("#add_user_cancel_tn").click(function(){
			$('#uer_manage_form').html("");
			$("#user_manage_table tr:last").remove();
		});
		$("#uer_manage_form").find('input[name="new_user"]').on('input', function() {
			if($(this).val().length < 2) {
				this.setCustomValidity("用户名太短了，不合法，^(*￣(oo)￣)^！");
			} else {
				this.setCustomValidity("");
			}
		
		});
		$("#uer_manage_form").find('input[name="passwd"]').on('input', function() {
			if($(this).val().length < 2) {
				this.setCustomValidity("密码太短了，^(*￣(oo)￣)^！");
			} else {
				var rpasswd=$("#uer_manage_form").find('input[name="r_passwd"]');
				if(rpasswd.val().length>0)
				{
					if($(this).val() != rpasswd.val()) {
						rpasswd[0].setCustomValidity("o(╥﹏╥)o，两次输入密码不一样");
					}else
					{
						rpasswd[0].setCustomValidity("");
					}
				}
				this.setCustomValidity("");
			}
		});
		$("#uer_manage_form").find('input[name="r_passwd"]').on('input', function() {
			if($(this).val() != $("#uer_manage_form").find('input[name="passwd"]').val()) {
				this.setCustomValidity("o(╥﹏╥)o，两次输入密码不一样");
			} else {
				this.setCustomValidity("");
			}
		
		});
		$("#uer_manage_form").on("submit", function() {
			$(this).find('.field_notice').remove();			
			$.post($USER_MANAGE_URL, $(this).serialize(), function(data) {
				var fhtml="";
				if(data.er_type==null)
				{
					add_message_dialog('add_new_user_error', '提示', '添加用户未知错误');
				}else if(data.er_type==0)
				{
					add_message_dialog('add_new_user_ok', '提示', '成功添加了一个用户！', true);
				}
				else if(data.er_type==1)
				{
					fhtml = '<div class="field_notice warn_color">用户名重复了，(⊙_⊙)?</div>';
					$('#uer_manage_form').find('input[name="new_user"]').after(fhtml);
				}	
				else if(data.er_type == 2) {
					fhtml = '<div class="field_notice warn_color">密码太短了，^(*￣(oo)￣)^！</div>';
					$('#uer_manage_form').find('input[name="passwd"]').after(fhtml);
				}
				else if(data.er_type == 3) {
					fhtml = '<div class="field_notice warn_color">o(╥﹏╥)o，两次输入密码一样';
					$('#uer_manage_form').find('input[name="r_passwd"]').after(fhtml);
				}
				else
				{
					add_message_dialog('add_new_user_error', '提示', data.error);
				}
			});

			return false;
		});
	});
	
	$("#chang_passwd_form").find('input[name="old_passwd"]').on('input',function(){
		if($(this).val().length < 2) {
			this.setCustomValidity("密码太短了，^(*￣(oo)￣)^！");
		}else
		{
			this.setCustomValidity("");
		}
		
	});
	$("#chang_passwd_form").find('input[name="new_passwd"]').on('input', function() {
		if($(this).val().length < 2) {
			this.setCustomValidity("密码太短了，^(*￣(oo)￣)^！");
		} else {
			var rpasswd = $("#chang_passwd_form").find('input[name="ensure_passwd"]');
			if(rpasswd.val().length > 0) {
				if($(this).val() != rpasswd.val()) {
					rpasswd[0].setCustomValidity("o(╥﹏╥)o，两次输入密码不一样");
				} else {
					rpasswd[0].setCustomValidity("");
				}
			}
			this.setCustomValidity("");
		}
	});
	$("#chang_passwd_form").find('input[name="ensure_passwd"]').on('input', function() {
		if($(this).val()!=$("#chang_passwd_form").find('input[name="new_passwd"]').val()) {
			this.setCustomValidity("o(╥﹏╥)o，两次输入密码不一样");
		} else {
			this.setCustomValidity("");
		}
	
	});
	$("#chang_passwd_form").on("submit", function() {
		$(this).find('.field_notice').remove();
		$.post($USER_MANAGE_URL, $(this).serialize(), function(data) {
			var fhtml='';	
			if(data.err_type==null) {
				add_message_dialog('change_passwd_error', '提示', '密码修改未知错误');
			} else if(data.err_type == 0) {
				add_message_dialog('change_passwd_ok', '提示', '成功修改用户密码！', true);
			} else if(data.err_type == 1) {
				fhtml='<div class="field_notice warn_color">原始密码输入错误</div>';
				$('#chang_passwd_form').find('input[name="old_passwd"]').after(fhtml);
			} else if(data.err_type == 3) {
				fhtml = '<div class="field_notice warn_color">密码修改失败数据库错误</div>';
				$('#chang_passwd_form').find('input[name="new_passwd"]').after(fhtml);
				//$('#uer_manage_form').find('input[name="new_passwd"]')[0].setCustomValidity("密码修改失败数据库错误，^(*￣(oo)￣)^！");
			} else if(data.err_type == 2) {
				fhtml = '<div class="field_notice warn_color">o(╥﹏╥)o，两次输入密码一样</div>';
				$('#chang_passwd_form').find('input[name="ensure_passwd"]').after(fhtml);
				//$('#uer_manage_form').find('input[name="ensure_passwd"]')[0].setCustomValidity("o(╥﹏╥)o，两次输入密码一样");
			} else {
				add_message_dialog('change_passwd_error', '提示', data.error);
			}
		});
	
		return false;
	});
	
	
//	
//	// Table Resize-able
//	$(".resizeable_tables").colResizable({
//		liveDrag: true,
//		minWidth: 40,
//	});
	
	$("#his_search_btn_id").click(function() {
		var start = $("#his_start_date_id").val() + " " + $("#his_start_time_id").val();
		var end = $("#his_end_date_id").val() + " " + $("#his_end_time_id").val();
		var tagname = $("#his_search_tag").val();
		var tagtype = $("#his_search_type").val();
		$.post("#", {
				start_time: start,
				end_time: end,
				tagnme: tagname,
				tagtype: tagtype
			},
			function(data) {
				var vhtml;
				if(data.hlist.length>0)
				{
					vhtml = '<table class="tables"><tbody><tr>';
					vhtml += '';
					for(x in data.hlist) {
						var tag=data.hlist[x];
						vhtml += '<tr><td>';
						vhtml += '<div class="widget_header cwhToggle"><h4 class="widget_header_title wwIcon i_16_cHorizontal">';
						vhtml += tag.tagshortdesc+'('+tag.tagname+')'+'-'+tag.typename;
						vhtml += '</h4></div>';
						vhtml += '<div class="widget_contents cwClose noPadding">';
						vhtml += '<div class="mycharts" id="charts' + x + '"></div></div>';
						vhtml += '</td></tr>';
					}
					vhtml += '</tbody></table>';
					$('#historylist').html(vhtml);
					$('#historylist').find(".cwhToggle").click(function() {
						// Get Height
						var wC = $(this).parents().eq(0).find('.widget_contents');
						var wH = $(this).find('.widget_header_title');
						var h = wC.height();
					
						if(h == 0) {
							wH.addClass("i_16_downT").removeClass("i_16_cHorizontal");
							wC.css('height', 'auto').removeClass('noPadding');
						} else {
							wH.addClass("i_16_cHorizontal").removeClass("i_16_downT");
							wC.css('height', '0').addClass('noPadding');
						}
					})
					for (x in data.hlist)
					{
						var tag=data.hlist[x];
						var chart_id='#charts'+x;
						var mychart=echarts.init($(chart_id)[0]);
						var myoption;
						if(tag.typename=='BOOL')
						{
							myoption = {
								title: {text:tag.tagname},
								tooltip: {trigger: 'axis'},
								legend: {data:[tag.tagname]},
								grid: {
									left: '3%',
									right: '4%',
									bottom: '3%',
									containLabel: true
								},
								toolbox: {feature: {saveAsImage: {}}},
								xAxis: {type: 'time',},
								yAxis: {type: 'value',min: 0,max: 1.5,interval: 1},
								series: [{
									name: 'value',
									type: 'line',
									step: 'end',
									data: tag.h_val
								}]
							};
						}else
						{
							myoption = {
								title: {text:tag.tagname},
								tooltip: {trigger: 'axis'},
								legend: {data:[tag.tagname]},
								grid: {
									left: '3%',
									right: '4%',
									bottom: '3%',
									containLabel: true
								},
								toolbox: {feature: {saveAsImage: {}}},
								xAxis: {type: 'time',},
								yAxis: {type: 'value'},
								series: [{
									name: 'value',
									type: 'line',
									data: tag.h_val
								}]
							};
						}
						mychart.setOption(myoption);
					}
				}else
				{
					vhtml='<span class="label"> 没找到任何记录信息</span>';
					$('#historylist').html(vhtml);
				}
				
			});
	});
});
