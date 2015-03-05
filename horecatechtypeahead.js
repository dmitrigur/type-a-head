// Dmitriy Guryanov

(function ($) {
	var horecaTechTypeAhead={};
		horecaTechTypeAhead.dataOpt={};
		horecaTechTypeAhead.data={};
		horecaTechTypeAhead.cssAttrArray={
			background:"background",
			boxShadow:"box-shadow",
			color:"color",
			border:"border",
			font:"font",
			textAlign:"text-align",
			textShadow:"text-shadow",
			lineHeight:"line-height",
			padding:"padding"
		};
		horecaTechTypeAhead.options = {
			Container : 'body',
			MaxLines:10,
			FixedWidth:false,
			Docking:true,
			Accentuation:true,
			LinesSeparator:true,
			FrameBackground:"rgba(0,0,0,0) none repeat scroll 0% 0% / auto padding-box border-box",
			SourceType:"A",
			SourceValKey:"value",
			SourceIdKey:"id",
			Source:{},
			URL:"",
			Params:{},
			ValueToken:"query",
			getSourceObject:function(value,func,arg) { // default API oriented function
				if (horecaTechTypeAhead.data[arg.id].URL!="") {
					function request(value,params,func,arg) {
						$.getJSON(horecaTechTypeAhead.data[arg.id].URL +'?callback=?',
							params,
							function(data) {
								if (horecaTechTypeAhead.data[arg.id].ResultSuffix!=null) {
									var result=data[horecaTechTypeAhead.data[arg.id].ResultSuffix];
								}  else {
									var result=data;
								}
								var A=[];
								for (i in result)
									A.push(result[i])
								func({Array:A,Sorted:true},value,value,arg);
							}
						);
					};
					if (horecaTechTypeAhead.data[arg.id].prepareParams!=null && typeof(horecaTechTypeAhead.data[arg.id].prepareParams)=='function')
						horecaTechTypeAhead.data[arg.id].prepareParams(
							value,
							func,
							arg, 
							request,
							horecaTechTypeAhead.data[arg.id].Params
						)
					else {
						horecaTechTypeAhead.data[arg.id].Params[horecaTechTypeAhead.data[arg.id].ValueToken]=value;
						request(value,horecaTechTypeAhead.data[arg.id].Params,func,arg)
					}
				}
			},
/*			prepareParams: function(value,func,arg,requestFunc,requestParams) {
				// DO SOMETHING WITH PARAMS including query assignment
				requestFunc(value,requestParams,func,arg)
			},*/
//			backgroundTarget:,
//			colorTarget:,
//			borderTarget:,
//			boxShadowTarget:,
//			positionTarget:
//			FrameShadowColor :"black",
//			backgroundColor : "white",
//			color : "black",
//			SelectedBackgroundColor: "black",
//			SelectedColor : "white",
//			AccentuationColor: "red",
//			SelectedAccentuationColor: "red",
//			LinesSeparatorColor: "grey",
		};
	function colorParse (color) {
		x0=color.indexOf("(");
		x1=color.indexOf(",",x0+1);
		x2=color.indexOf(",",x1+1);
		r=parseInt(color.substr(x0+1,x1-x0-1));
		g=parseInt(color.substr(x1+1,x2-x1-1));
		if (color.substr(0,4)=='rgba') {
			x3=color.indexOf(",",x2+1);
			x4=color.indexOf(")",x3+1);
			b=parseInt(color.substr(x2+1,x3-x2-1));
			a=parseFloat(color.substr(x3+1,x4-x3-1));
		} else {
			x3=color.indexOf(")",x2+1);
			b=parseInt(color.substr(x2+1,x3-x2-1));
			a=1;
		}
		return {r:r,g:g,b:b,a:a};
	};
	function rgbToHsl(c){
		c.r/=255,c.g/=255,c.b/=255;
		var max=Math.max(c.r,c.g,c.b),min=Math.min(c.r,c.g,c.b);
		var h,s,l=(c.r+c.g+c.b)/0.03;
		if (max==min)
			h=s=0; // achromatic
		else {
			var d=(max-min);
			s=l>50?d*100/(2-max-min):d*100/(max+min);
			switch(max){
				case c.r: h=(c.g-c.b)/d+(c.g<c.b?6:0);break;
				case c.g: h=(c.b-c.r)/d+2;break;
				case c.b: h=(c.r-c.g)/d+4;break;
			}
			h=Math.round(h/6*360);
		};
		return {h:h,s:s,l:l,a:c.a};
	};
	$.fn.HorecaTechTypeaheadOff = function() {
		this.off("click.httypeahead");
		this.off("keyup.httypeahead");
		delete horecaTechTypeAhead.dataOpt[$(this).attr("id")];
	};
	$.fn.HorecaTechTypeahead = function(opt) {
		function scrollbarWidth() {
			var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>');
			// Append our div, do our calculation and then remove it
			$('body').append(div);
			var w1 = $('div', div).innerWidth();
			div.css('overflow-y', 'scroll');
			var w2 = $('div', div).innerWidth();
			$(div).remove();
			return (w1 - w2);
		};
		var targetID=$(this).attr("id");
	// первоначальная копия дефолтных значений в создаваемый шаблон
		if (horecaTechTypeAhead.dataOpt[targetID]==null) {
			horecaTechTypeAhead.dataOpt[targetID]=$.extend(true,{},horecaTechTypeAhead.options);
			horecaTechTypeAhead.dataOpt[targetID].getSourceObject=horecaTechTypeAhead.options.getSourceObject;
			horecaTechTypeAhead.dataOpt[targetID].prepareParams=horecaTechTypeAhead.options.prepareParams;
		};
		
// наложение импортируемых на шаблон 
		horecaTechTypeAhead.dataOpt[targetID]=$.extend(true,horecaTechTypeAhead.dataOpt[targetID],opt);
		if (opt.getSourceObject!=null) 
			horecaTechTypeAhead.dataOpt[targetID].getSourceObject=opt.getSourceObject;
		if (opt.prepareParams!=null) 
			horecaTechTypeAhead.dataOpt[targetID].prepareParams=opt.prepareParams;
		horecaTechTypeAhead.dataOpt[targetID].scrollbarwidth=(horecaTechTypeAhead.dataOpt[targetID].scrollbarwidth==null)?scrollbarWidth():horecaTechTypeAhead.dataOpt[targetID].scrollbarwidth;
		horecaTechTypeAhead.dataOpt[targetID].prevValue=null;
		horecaTechTypeAhead.dataOpt[targetID].prevValueID="";
		this.off("click.httypeahead keyup.httypeahead");
		this.on("click.httypeahead keyup.httypeahead",function(e) {
			function build(value,valueID,targetID) {
				function sort_func(a,b) {
					if (a[horecaTechTypeAhead.data[targetID].SourceSortKey_] < b[horecaTechTypeAhead.data[targetID].SourceSortKey_]) return -1;
					if (a[horecaTechTypeAhead.data[targetID].SourceSortKey_] > b[horecaTechTypeAhead.data[targetID].SourceSortKey_]) return 1;
					return 0;
				};
				function sort_func_index(a,b) {
					if (a.index < b.index) return -1;
					if (a.index > b.index) return 1;
					if (a.value < b.value) return -1;
					if (a.value > b.value) return 1;
					return 0;
				};
				function sort_func_index_sort(a,b) {
					if (a.index < b.index) return -1;
					if (a.index > b.index) return 1;
					if (a.sort < b.sort) return -1;
					if (a.sort > b.sort) return 1;
					return 0;
				};
				if (valueID==null) valueID=horecaTechTypeAhead.data[targetID].prevValueID;
				if (horecaTechTypeAhead.data[targetID].Source[valueID]!=null && (horecaTechTypeAhead.data[targetID].prevValue!=value || horecaTechTypeAhead.data[targetID].Source[valueID].built==null)) {
					if (horecaTechTypeAhead.data[targetID].prevValueID!=null && horecaTechTypeAhead.data[targetID].prevValueID!=undefined && horecaTechTypeAhead.data[targetID].Source[horecaTechTypeAhead.data[targetID].prevValueID]!=null) 
						delete horecaTechTypeAhead.data[targetID].Source[horecaTechTypeAhead.data[targetID].prevValueID].built;
					horecaTechTypeAhead.data[targetID].prevValue=value;
					horecaTechTypeAhead.data[targetID].prevValueID=valueID;
					horecaTechTypeAhead.data[targetID].Source[valueID].built=true;
					var SourceValKey=(horecaTechTypeAhead.data[targetID].Source[valueID].ValKey==null)?horecaTechTypeAhead.data[targetID].SourceValKey:horecaTechTypeAhead.data[targetID].Source[valueID].ValKey;
					horecaTechTypeAhead.data[targetID].Array=[];
					horecaTechTypeAhead.data[targetID].SourceSortKey_=(horecaTechTypeAhead.data[targetID].Source[valueID].SortKey!=null)?horecaTechTypeAhead.data[targetID].Source[valueID].SortKey:(horecaTechTypeAhead.data[targetID].SourceSortKey!=null)?horecaTechTypeAhead.data[targetID].SourceSortKey:SourceValKey;
					horecaTechTypeAhead.data[targetID].SourceIdKey_=(horecaTechTypeAhead.data[targetID].Source[valueID].IdKey==null)?horecaTechTypeAhead.data[targetID].SourceIdKey:horecaTechTypeAhead.data[targetID].Source[valueID].IdKey;
					horecaTechTypeAhead.data[targetID].SourcePutKey_=(horecaTechTypeAhead.data[targetID].Source[valueID].PutKey!=null)?horecaTechTypeAhead.data[targetID].Source[valueID].PutKey:(horecaTechTypeAhead.data[targetID].SourcePutKey!=null)?horecaTechTypeAhead.data[targetID].SourcePutKey:SourceValKey;
					horecaTechTypeAhead.data[targetID].SourceType_=(horecaTechTypeAhead.data[targetID].Source[valueID].Type==null)?horecaTechTypeAhead.data[targetID].SourceType:horecaTechTypeAhead.data[targetID].Source[valueID].Type;
					if (horecaTechTypeAhead.data[targetID].SourceType_==null) horecaTechTypeAhead.data[targetID].SourceType_=(horecaTechTypeAhead.data[targetID].Source[valueID].Array.prototype.toString.call(arguments[2])=="[object Array]")?"A":"O";
					if (horecaTechTypeAhead.data[targetID].SourceType_=="A") {
						if (!horecaTechTypeAhead.data[targetID].Source[valueID].Sorted) {
							horecaTechTypeAhead.data[targetID].Source[valueID].Array.sort()
							horecaTechTypeAhead.data[targetID].Source[valueID].Sorted=true;
						};
						if (value!=valueID) {
							for (a in horecaTechTypeAhead.data[targetID].Source[valueID].Array) {
								var index=horecaTechTypeAhead.data[targetID].Source[valueID].Array[a].toLowerCase().indexOf(value.toLowerCase());
								if (index>-1)
									horecaTechTypeAhead.data[targetID].Array.push({value:horecaTechTypeAhead.data[targetID].Source[valueID].Array[a],id:horecaTechTypeAhead.data[targetID].Source[valueID].Array[a],index:index});
							};
							horecaTechTypeAhead.data[targetID].Array.sort(sort_func_index);
						} else
							for (a in horecaTechTypeAhead.data[targetID].Source[valueID].Array)
								horecaTechTypeAhead.data[targetID].Array.push({value:horecaTechTypeAhead.data[targetID].Source[valueID].Array[a],id:horecaTechTypeAhead.data[targetID].Source[valueID].Array[a],index:horecaTechTypeAhead.data[targetID].Source[valueID].Array[a].toLowerCase().indexOf(value.toLowerCase())});
					} else {
						if (!horecaTechTypeAhead.data[targetID].Source[valueID].Sorted) {
							horecaTechTypeAhead.data[targetID].Source[valueID].Array.sort(sort_func)
							horecaTechTypeAhead.data[targetID].Source[valueID].Sorted=true;
						};
						if (value!=valueID) {
							for (a in horecaTechTypeAhead.data[targetID].Source[valueID].Array) {
								var index=horecaTechTypeAhead.data[targetID].Source[valueID].Array[a][SourceValKey].toLowerCase().indexOf(value.toLowerCase());
								if (index>-1)
									horecaTechTypeAhead.data[targetID].Array.push({sort:horecaTechTypeAhead.data[targetID].Source[valueID].Array[a][horecaTechTypeAhead.data[targetID].SourceSortKey_],value:horecaTechTypeAhead.data[targetID].Source[valueID].Array[a][SourceValKey],id:horecaTechTypeAhead.data[targetID].Source[valueID].Array[a][horecaTechTypeAhead.data[targetID].SourceIdKey_],index:index});
							};
							horecaTechTypeAhead.data[targetID].Array.sort(sort_func_index_sort);
						} else
							for (a in horecaTechTypeAhead.data[targetID].Source[valueID].Array)
								horecaTechTypeAhead.data[targetID].Array.push({value:horecaTechTypeAhead.data[targetID].Source[valueID].Array[a][SourceValKey],id:horecaTechTypeAhead.data[targetID].Source[valueID].Array[a][horecaTechTypeAhead.data[targetID].SourceIdKey_],index:horecaTechTypeAhead.data[targetID].Source[valueID].Array[a][SourceValKey].toLowerCase().indexOf(value.toLowerCase())});
					};
					if (horecaTechTypeAhead.data[targetID].Array.length==0) {
						$("#httypeahead_frame_"+targetID).css("display","none");
						$("#httypeahead_container_"+targetID).empty();
						if (horecaTechTypeAhead.data[targetID].Docking) {
							$("#"+horecaTechTypeAhead.data[targetID].borderTarget).css({borderBottomLeftRadius:horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Left,borderBottomRightRadius:horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Right});
							$("#"+horecaTechTypeAhead.data[targetID].borderTarget).css({borderTopLeftRadius:horecaTechTypeAhead.data[targetID].borderRadius.Top.Left,borderTopRightRadius:horecaTechTypeAhead.data[targetID].borderRadius.Top.Right});
						};
					} else {
						var str="";
						for (var a in horecaTechTypeAhead.data[targetID].Array)
							str+="<p key=\""+valueID+"\" tg=\""+targetID+"\" indx=\""+a+"\" id=\"httypeahead_element_"+targetID+a+"\" class=\"httypeahead_element_class_"+targetID+"\">"+((horecaTechTypeAhead.data[targetID].Array[a].index<0 || !horecaTechTypeAhead.data[targetID].Accentuation)?horecaTechTypeAhead.data[targetID].Array[a].value:(horecaTechTypeAhead.data[targetID].Array[a].value.substr(0,horecaTechTypeAhead.data[targetID].Array[a].index)+"<span style=\"COLOR:"+horecaTechTypeAhead.data[targetID].AccentuationColor+"\">"+horecaTechTypeAhead.data[targetID].Array[a].value.substr(horecaTechTypeAhead.data[targetID].Array[a].index,value.length)+"</span>"+horecaTechTypeAhead.data[targetID].Array[a].value.substr(horecaTechTypeAhead.data[targetID].Array[a].index+value.length,horecaTechTypeAhead.data[targetID].Array[a].value.length-horecaTechTypeAhead.data[targetID].Array[a].index-value.length)))+"</p>";
						$("#httypeahead_container_"+targetID).html(str);
						var	scr_height=$(window).height(),
							scr_width=$(window).width();
						$("#httypeahead_frame_"+targetID).css("display","block");
						$("#httypeahead_frame_"+targetID).width(scr_width);				
						var	content_height=$("#httypeahead_container_"+targetID).height(),
							content_height_to_show=Math.min(horecaTechTypeAhead.data[targetID].MaxLines*horecaTechTypeAhead.data[targetID].lineHeightInt,content_height),
							border__=parseInt($("#httypeahead_frame_"+targetID).css("border-top-width").substr(0,$("#httypeahead_frame_"+targetID).css("border-top-width").length-2))+parseInt($("#httypeahead_frame_"+targetID).css("border-bottom-width").substr(0,$("#httypeahead_frame_"+targetID).css("border-bottom-width").length-2));
						if (scr_height-horecaTechTypeAhead.data[targetID].coord.bottom<content_height_to_show+border__) {
							if (scr_height-horecaTechTypeAhead.data[targetID].coord.bottom>horecaTechTypeAhead.data[targetID].coord.top) {
								horecaTechTypeAhead.data[targetID].position='b';
								content_height_to_show=scr_height-horecaTechTypeAhead.data[targetID].coord.bottom-border__;
							} else {
								horecaTechTypeAhead.data[targetID].position='t';
								content_height_to_show=Math.min(content_height_to_show,horecaTechTypeAhead.data[targetID].coord.top-border__);
							}
						} else
							horecaTechTypeAhead.data[targetID].position='b';
						$("#httypeahead_frame_"+targetID).height(content_height_to_show);
						horecaTechTypeAhead.data[targetID].content_width=$("#httypeahead_container_"+targetID).width();
						$("#httypeahead_container_"+targetID).width(Math.max(horecaTechTypeAhead.data[targetID].content_width,horecaTechTypeAhead.data[targetID].width-horecaTechTypeAhead.data[targetID].scrollbarwidth*((content_height>content_height_to_show)?1:0)))
						$("#httypeahead_frame_"+targetID).width(Math.max(horecaTechTypeAhead.data[targetID].width,horecaTechTypeAhead.data[targetID].content_width+horecaTechTypeAhead.data[targetID].scrollbarwidth*((content_height>content_height_to_show)?1:0)));
						var fr_width=$("#httypeahead_frame_"+targetID).width();
						if (scr_width-horecaTechTypeAhead.data[targetID].coord.left>=fr_width) {
							$("#httypeahead_frame_"+targetID).css({left:horecaTechTypeAhead.data[targetID].coord.left})
							l_offset=0;
							r_offset=fr_width-horecaTechTypeAhead.data[targetID].width;
						} else if (scr_width-horecaTechTypeAhead.data[targetID].coord.right>=fr_width) {
							$("#httypeahead_frame_"+targetID).css({left:horecaTechTypeAhead.data[targetID].coord.right-fr_width})
							r_offset=0;
							l_offset=fr_width-horecaTechTypeAhead.data[targetID].width;
						} else {
							$("#httypeahead_frame_"+targetID).css({left:(scr_width-fr_width)/2});
							l_offset=(scr_width-fr_width)/2-horecaTechTypeAhead.data[targetID].coord.left;
							r_offset=(scr_width-fr_width)/2-horecaTechTypeAhead.data[targetID].coord.right;
						};
						if (horecaTechTypeAhead.data[targetID].position=='b') {
							$("#httypeahead_frame_"+targetID).css({top:horecaTechTypeAhead.data[targetID].coord.bottom});
							if(horecaTechTypeAhead.data[targetID].Docking) {
								$("#httypeahead_frame_"+targetID).css({borderTopLeftRadius:Math.min(horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Left,Math.max(0,l_offset)),borderTopRightRadius:Math.min(horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Right,Math.max(0,r_offset)),borderBottomLeftRadius:horecaTechTypeAhead.data[targetID].borderRadius.Top.Left,borderBottomRightRadius:horecaTechTypeAhead.data[targetID].borderRadius.Top.Right});
								$("#"+horecaTechTypeAhead.data[targetID].borderTarget).css({borderBottomLeftRadius:Math.min(horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Left,Math.max(0,-l_offset)),borderBottomRightRadius:Math.min(horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Right,Math.max(0,-r_offset)),borderTopLeftRadius:horecaTechTypeAhead.data[targetID].borderRadius.Top.Left,borderTopRightRadius:horecaTechTypeAhead.data[targetID].borderRadius.Top.Right});
							}
						} else {
							$("#httypeahead_frame_"+targetID).css({top:horecaTechTypeAhead.data[targetID].coord.top-content_height_to_show-border__});
							if(horecaTechTypeAhead.data[targetID].Docking) {
								$("#httypeahead_frame_"+targetID).css({borderBottomLeftRadius:Math.min(horecaTechTypeAhead.data[targetID].borderRadius.Top.Left,Math.max(0,l_offset)),borderBottomRightRadius:Math.min(horecaTechTypeAhead.data[targetID].borderRadius.Top.Right,Math.max(0,r_offset)),borderTopLeftRadius:horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Left,borderTopRightRadius:horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Right});
								$("#"+horecaTechTypeAhead.data[targetID].borderTarget).css({borderTopLeftRadius:Math.min(horecaTechTypeAhead.data[targetID].borderRadius.Top.Left,Math.max(0,-l_offset)),borderTopRightRadius:Math.min(horecaTechTypeAhead.data[targetID].borderRadius.Top.Right,Math.max(0,-r_offset)),borderBottomLeftRadius:horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Left,borderBottomRightRadius:horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Right});
							}
						};
						$(".httypeahead_element_class_"+targetID).on("mouseout.httypeahead",function(e) {
							$("."+$(this).attr("class")).css({backgroundColor:"transparent",color:horecaTechTypeAhead.data[targetID].color,textShadow:horecaTechTypeAhead.data[targetID].textShadow});
						});
						$(".httypeahead_element_class_"+targetID).on("mouseover.httypeahead",function(e) {
							$(this).css({backgroundColor:horecaTechTypeAhead.data[targetID].SelectedBackGroundColor,color:horecaTechTypeAhead.data[targetID].SelectedColor,textShadow:horecaTechTypeAhead.data[targetID].SelectedTextShadow});
						});
						$(".httypeahead_element_class_"+targetID).on("mousedown.httypeahead ",function(e) {
							$(document).off("change.httypeahead click.httypeahead scroll.httypeahead");
							e.stopPropagation();
							var targetID=$(this).attr("tg"),
								index=$(this).attr("indx"),
								valueID=$(this).attr("key");
							$("#httypeahead_frame_"+targetID).remove();
							if (horecaTechTypeAhead.data[targetID].Docking) {
								$("#"+horecaTechTypeAhead.data[targetID].borderTarget).css({borderBottomLeftRadius:horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Left,borderBottomRightRadius:horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Right});
								$("#"+horecaTechTypeAhead.data[targetID].borderTarget).css({borderTopLeftRadius:horecaTechTypeAhead.data[targetID].borderRadius.Top.Left,borderTopRightRadius:horecaTechTypeAhead.data[targetID].borderRadius.Top.Right});
							};
							if (horecaTechTypeAhead.data[targetID].SourcePutKey_!=null && horecaTechTypeAhead.data[targetID].SourcePutKey_!="")
								$("#"+targetID).val((horecaTechTypeAhead.data[targetID].SourceType_=="A")?horecaTechTypeAhead.data[targetID].Source[valueID].Array[index]:horecaTechTypeAhead.data[targetID].Source[valueID].Array[index][horecaTechTypeAhead.data[targetID].SourcePutKey_]);
							if (horecaTechTypeAhead.data[targetID].onClose!=null && typeof(horecaTechTypeAhead.data[targetID].onClose)=='function')
								horecaTechTypeAhead.data[targetID].onClose(horecaTechTypeAhead.data[targetID].target,horecaTechTypeAhead.data[targetID].Array[index],horecaTechTypeAhead.data[targetID].SourceType_,horecaTechTypeAhead.data[targetID].SourceIdKey_,horecaTechTypeAhead.data[targetID].SourcePutKey_);
							delete horecaTechTypeAhead.data[targetID];
						});
					}
				}
			};
			e.stopPropagation();
			var targetID=$(this).attr("id");
			if (e.type=='click' && $("#httypeahead_frame_"+targetID).length==0) {
				$(".httypeahead").each(function() {
					var targetID=$(this).attr("tg");
					$("#httypeahead_frame_"+targetID).remove();
					if (targetID!=null && horecaTechTypeAhead.data[targetID]!=null) {
						if (horecaTechTypeAhead.data[targetID].Docking) {
							$("#"+horecaTechTypeAhead.data[targetID].borderTarget).css({borderBottomLeftRadius:horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Left,borderBottomRightRadius:horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Right});
							$("#"+horecaTechTypeAhead.data[targetID].borderTarget).css({borderTopLeftRadius:horecaTechTypeAhead.data[targetID].borderRadius.Top.Left,borderTopRightRadius:horecaTechTypeAhead.data[targetID].borderRadius.Top.Right});
						};
						if (horecaTechTypeAhead.data[targetID].onCancel!=null && typeof(horecaTechTypeAhead.data[targetID].onCancel)=='function')
							horecaTechTypeAhead.data[targetID].onCancel(targetID);
					};
					delete horecaTechTypeAhead.data[targetID];
				});
				horecaTechTypeAhead.data[targetID]=$.extend(true,{},horecaTechTypeAhead.dataOpt[targetID]);
				horecaTechTypeAhead.data[targetID].target=this;
				horecaTechTypeAhead.data[targetID].getSourceObject=horecaTechTypeAhead.dataOpt[targetID].getSourceObject;
				horecaTechTypeAhead.data[targetID].prepareParams=horecaTechTypeAhead.dataOpt[targetID].prepareParams;
				$((horecaTechTypeAhead.data[targetID].Container=='body')?horecaTechTypeAhead.data[targetID].Container:("#"+horecaTechTypeAhead.data[targetID].Container)).append('<div id="httypeahead_frame_'+targetID+'" tg="'+targetID+'" class="httypeahead httypeahead_frame_class_'+targetID+'"><div id="httypeahead_container_'+targetID+'" wrap="soft" class="httypeahead_container_class_'+targetID+'"></div></div>');
				$("#httypeahead_frame_"+targetID).append("<style>.httypeahead_frame_class_"+targetID+"{z-index:20;width:auto;height:auto;position:fixed;display:block;overflow-y:auto;overflow-x:hidden} .httypeahead_container_class_"+targetID+"{background-color:transparent;width:auto;height:auto;top:0;left:0;position:absolute;display:block;overflow:hidden}</style>");
				horecaTechTypeAhead.data[targetID].target=this;
				horecaTechTypeAhead.data[targetID].attr={};
				for (attr in this.attributes)
					if (this.attributes[attr].name!=null)
						horecaTechTypeAhead.data[targetID].attr[this.attributes[attr].name]=this.attributes[attr].value;
				for (var css_attr in horecaTechTypeAhead.cssAttrArray)
					horecaTechTypeAhead.data[targetID][css_attr]=(horecaTechTypeAhead.dataOpt[targetID][css_attr]==null)?$("#"+(($("#"+horecaTechTypeAhead.data[targetID][css_attr+"Target"]).length!=0)?horecaTechTypeAhead.data[targetID][css_attr+"Target"]:targetID)).css(horecaTechTypeAhead.cssAttrArray[css_attr]):horecaTechTypeAhead.dataOpt[targetID][css_attr];
				horecaTechTypeAhead.data[targetID].lineHeightInt=parseInt(horecaTechTypeAhead.data[targetID].lineHeight.substr(0,horecaTechTypeAhead.data[targetID].lineHeight.length-2))+((horecaTechTypeAhead.data[targetID].LinesSeparator)?1:0);
				horecaTechTypeAhead.data[targetID].borderTarget=($("#"+horecaTechTypeAhead.data[targetID].borderTarget).length!=0)?horecaTechTypeAhead.data[targetID].borderTarget:targetID;
				horecaTechTypeAhead.data[targetID].borderRadius={
					Top:{
						Left:	parseInt($("#"+horecaTechTypeAhead.data[targetID].borderTarget).css("border-top-left-radius").substr(0,$("#"+horecaTechTypeAhead.data[targetID].borderTarget).css("border-top-left-radius").length-2)),
						Right:	parseInt($("#"+horecaTechTypeAhead.data[targetID].borderTarget).css("border-top-right-radius").substr(0,$("#"+horecaTechTypeAhead.data[targetID].borderTarget).css("border-top-right-radius").length-2))
					},
					Bottom: {
						Left:	parseInt($("#"+horecaTechTypeAhead.data[targetID].borderTarget).css("border-bottom-left-radius").substr(0,$("#"+horecaTechTypeAhead.data[targetID].borderTarget).css("border-bottom-left-radius").length-2)),
						Right:	parseInt($("#"+horecaTechTypeAhead.data[targetID].borderTarget).css("border-bottom-right-radius").substr(0,$("#"+horecaTechTypeAhead.data[targetID].borderTarget).css("border-bottom-right-radius").length-2))
					}
				};
				$("#httypeahead_frame_"+targetID).css({boxShadow:horecaTechTypeAhead.data[targetID].boxShadow,background:horecaTechTypeAhead.data[targetID].FrameBackground,borderTopLeftRadius:horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Left,borderTopRightRadius:horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Right,borderBottomLeftRadius:horecaTechTypeAhead.data[targetID].borderRadius.Top.Left,borderBottomRightRadius:horecaTechTypeAhead.data[targetID].borderRadius.Top.Right,border:horecaTechTypeAhead.data[targetID].border,font:horecaTechTypeAhead.data[targetID].font,textAlign:horecaTechTypeAhead.data[targetID].textAlign,textShadow:horecaTechTypeAhead.data[targetID].textShadow,lineHeight:horecaTechTypeAhead.data[targetID].lineHeight,color:horecaTechTypeAhead.data[targetID].color});
				$("#httypeahead_container_"+targetID).css("background",horecaTechTypeAhead.data[targetID].background);
				horecaTechTypeAhead.data[targetID].width=$("#"+(($("#"+horecaTechTypeAhead.data[targetID].widthTarget).length!=0)?horecaTechTypeAhead.data[targetID].widthTarget:targetID)).width();
				horecaTechTypeAhead.data[targetID].coord=document.getElementById((horecaTechTypeAhead.data[targetID].positionTarget!=null)?horecaTechTypeAhead.data[targetID].positionTarget:targetID).getBoundingClientRect(),
				horecaTechTypeAhead.data[targetID].textShadowColor=(horecaTechTypeAhead.dataOpt[targetID].textShadowColor==null)?(horecaTechTypeAhead.data[targetID].textShadow.substr(0,horecaTechTypeAhead.data[targetID].textShadow.indexOf(")")+1)):horecaTechTypeAhead.dataOpt[targetID].textShadowColor;
				horecaTechTypeAhead.data[targetID].backgroundColor=(horecaTechTypeAhead.dataOpt[targetID].backgroundColor==null)?$("#"+(($("#"+horecaTechTypeAhead.data[targetID]["backgroundTarget"]).length!=0)?horecaTechTypeAhead.data[targetID]["backgroundTarget"]:targetID)).css("background-color"):horecaTechTypeAhead.dataOpt[targetID].backgroundColor;
				horecaTechTypeAhead.data[targetID].colorHSLA=rgbToHsl(colorParse(horecaTechTypeAhead.data[targetID].color));
				horecaTechTypeAhead.data[targetID].backgroundColorHSLA=rgbToHsl(colorParse(horecaTechTypeAhead.data[targetID].backgroundColor));
				horecaTechTypeAhead.data[targetID].textShadowColorHSLA=rgbToHsl(colorParse(horecaTechTypeAhead.data[targetID].textShadowColor));
				horecaTechTypeAhead.data[targetID].LinesSeparatorColor=(horecaTechTypeAhead.dataOpt[targetID].LinesSeparatorColor==null)?"HSLA("+horecaTechTypeAhead.data[targetID].colorHSLA.h+","+horecaTechTypeAhead.data[targetID].colorHSLA.s+"%,"+horecaTechTypeAhead.data[targetID].colorHSLA.l+"%,"+(horecaTechTypeAhead.data[targetID].colorHSLA.a*0.3)+")":horecaTechTypeAhead.dataOpt[targetID].LinesSeparatorColor;
				horecaTechTypeAhead.data[targetID].AccentuationColor=(horecaTechTypeAhead.dataOpt[targetID].AccentuationColor==null)?"HSLA("+Math.round(((horecaTechTypeAhead.data[targetID].colorHSLA.h+horecaTechTypeAhead.data[targetID].backgroundColorHSLA.h)/2+180)%360)+",100%,"+(((horecaTechTypeAhead.data[targetID].colorHSLA.l+horecaTechTypeAhead.data[targetID].backgroundColorHSLA.l)/2+Math.abs((horecaTechTypeAhead.data[targetID].colorHSLA.l+horecaTechTypeAhead.data[targetID].backgroundColorHSLA.l)/2-100))/2)+"%,"+horecaTechTypeAhead.data[targetID].colorHSLA.a+")":horecaTechTypeAhead.dataOpt[targetID].AccentuationColor;
				horecaTechTypeAhead.data[targetID].SelectedColor=(horecaTechTypeAhead.dataOpt[targetID].SelectedColor==null)?"HSLA("+horecaTechTypeAhead.data[targetID].colorHSLA.h+","+horecaTechTypeAhead.data[targetID].colorHSLA.s+"%,"+Math.abs(horecaTechTypeAhead.data[targetID].colorHSLA.l-100)+"%,"+horecaTechTypeAhead.data[targetID].colorHSLA.a+")":horecaTechTypeAhead.dataOpt[targetID].SelectedColor;
				horecaTechTypeAhead.data[targetID].SelectedTextShadow=(horecaTechTypeAhead.dataOpt[targetID].SelectedTextShadow==null)?("HSLA("+horecaTechTypeAhead.data[targetID].textShadowColorHSLA.h+","+horecaTechTypeAhead.data[targetID].textShadowColorHSLA.s+"%,"+Math.abs(horecaTechTypeAhead.data[targetID].textShadowColorHSLA.l-100)+"%,"+horecaTechTypeAhead.data[targetID].textShadowColorHSLA.a+")"+horecaTechTypeAhead.data[targetID].textShadow.substr(horecaTechTypeAhead.data[targetID].textShadow.indexOf(')')+1,horecaTechTypeAhead.data[targetID].textShadow.length-horecaTechTypeAhead.data[targetID].textShadow.indexOf(')')-1)):horecaTechTypeAhead.dataOpt[targetID].SelectedTextShadow;
				horecaTechTypeAhead.data[targetID].SelectedBackGroundColor=(horecaTechTypeAhead.dataOpt[targetID].SelectedBackGroundColor==null)?"HSLA("+horecaTechTypeAhead.data[targetID].backgroundColorHSLA.h+","+horecaTechTypeAhead.data[targetID].backgroundColorHSLA.s+"%,"+Math.abs(horecaTechTypeAhead.data[targetID].backgroundColorHSLA.l-100)+"%,"+horecaTechTypeAhead.data[targetID].backgroundColorHSLA.a+")":horecaTechTypeAhead.dataOpt[targetID].SelectedBackGroundColor;
				horecaTechTypeAhead.data[targetID].SelectedAccentuationColor=(horecaTechTypeAhead.dataOpt[targetID].SelectedAccentuationColor==null)?horecaTechTypeAhead.data[targetID].AccentuationColor:horecaTechTypeAhead.dataOpt[targetID].SelectedAccentuationColor;
				var stylehtml=".httypeahead_element_class_"+targetID+" {max-width:"+$(window).width()+";margin:0;color:"+horecaTechTypeAhead.data[targetID].color+";width:auto;overflow:hidden;position:relative;display:block;"+((horecaTechTypeAhead.data[targetID].LinesSeparator)?("border-top:1px solid "+horecaTechTypeAhead.data[targetID].LinesSeparatorColor):"")+"}";
				if ($("#httypeahead_style"+targetID).length==0)
					$("#httypeahead_frame_"+targetID).append("<style id=\"httypeahead_style"+targetID+"\">"+stylehtml+"</style>");
				else 
					$("#httypeahead_style"+targetID).html(stylehtml);
				$(document).off("change.httypeahead click.httypeahead scroll.httypeahead");
				$(document).on("change.httypeahead click.httypeahead scroll.httypeahead",function() {
					$(document).off("change.httypeahead click.httypeahead scroll.httypeahead");
					$(".httypeahead").each(function() {
						var targetID=$(this).attr("tg");
						$("#httypeahead_frame_"+targetID).remove();
						if (targetID!=null && horecaTechTypeAhead.data[targetID]!=null) {
							if (horecaTechTypeAhead.data[targetID].Docking) {
								$("#"+horecaTechTypeAhead.data[targetID].borderTarget).css({borderBottomLeftRadius:horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Left,borderBottomRightRadius:horecaTechTypeAhead.data[targetID].borderRadius.Bottom.Right});
								$("#"+horecaTechTypeAhead.data[targetID].borderTarget).css({borderTopLeftRadius:horecaTechTypeAhead.data[targetID].borderRadius.Top.Left,borderTopRightRadius:horecaTechTypeAhead.data[targetID].borderRadius.Top.Right});
							};
							if (horecaTechTypeAhead.data[targetID].onCancel!=null && typeof(horecaTechTypeAhead.data[targetID].onCancel)=='function')
								horecaTechTypeAhead.data[targetID].onCancel(targetID);
						};
						delete horecaTechTypeAhead.data[targetID];
					});
				});
			};
			var value=$(this).val();
			if (horecaTechTypeAhead.data[targetID]!=null) {
				if (horecaTechTypeAhead.data[targetID].Source[value]==null) {
					horecaTechTypeAhead.data[targetID].getSourceObject(value,function(result,value,valueID,arg) {
						horecaTechTypeAhead.data[arg.id].Source[valueID]=result;
						build(value,valueID,arg.id);
					},horecaTechTypeAhead.data[targetID].attr);
					build(value,null,targetID);
				} else 
					build(value,value,targetID);
			}
		});
	};	
}(jQuery));
