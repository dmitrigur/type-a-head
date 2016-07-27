/*
 * Dmitriy Guryanov 2015
 */

(function ($) {
    var horecaTechTypeAhead = {};
    horecaTechTypeAhead.counter = 0;
    horecaTechTypeAhead.dataOpt = {};
    horecaTechTypeAhead.data = {};
    horecaTechTypeAhead.cssAttrArray = {
        background: "background",
        backgroundColor: "background-color",
        backgroundImage: "background-image",
        backgroundSize: "background-size",
        backgroundPosition: "background-position",
        backgroundRepeat: "background-repeat",
        backgroundAttachment: "background-attachment",
        boxSizing: "box-sizing",
        boxShadow: "box-shadow",
        color: "color",
        border: "border",
        borderBottomColor: "border-bottom-color",
        borderBottomStyle: "border-bottom-style",
        borderBottomWidth: "border-bottom-width",
        borderTopColor: "border-top-color",
        borderTopStyle: "border-top-style",
        borderTopWidth: "border-top-width",
        borderLeftColor: "border-left-color",
        borderLeftStyle: "border-left-style",
        borderLeftWidth: "border-left-width",
        borderRightColor: "border-right-color",
        borderRightStyle: "border-right-style",
        borderRightWidth: "border-right-width",
        borderBottomLeftRadius: "border-bottom-left-radius",
        borderBottomRightRadius: "border-bottom-right-radius",
        borderTopLeftRadius: "border-top-left-radius",
        borderTopRightRadius: "border-top-right-radius",
        font: "font",
        fontWeight: "font-weight",
        fontStyle: "font-style",
        fontVariant: "font-variant",
        fontSize: "font-size",
        fontFamily: "font-family",
        textAlign: "text-align",
        textShadow: "text-shadow",
        lineHeight: "line-height",
        paddingTop: "padding-top",
        paddingBottom: "padding-bottom",
        paddingLeft: "padding-left",
        paddingRight: "padding-right"
    }
    horecaTechTypeAhead.stdColor = {
        white: "#ffffff",
        silver: "#c0c0c0",
        grey: "#808080",
        red: "#ff0000",
        orange: "#ffa500",
        yellow: "#ffff00",
        lime: "#00ff00",
        aqua: "#00ffff",
        blue: "#0000ff",
        fuchsia: "#ff00ff",
        maroon: "#800000",
        olive: "#808000",
        green: "#008000",
        teal: "#008080",
        navy: "#000080",
        purple: "#800080",
        black: "#000000"
    }
    horecaTechTypeAhead.options = {
        container: 'body',
        maxLines: 10,
        fixedWidth: false,
        isDocking: true,
        isAccentuation: true,
        isLinesSeparator: true,
        frameBackground: "rgba(0,0,0,0) none repeat scroll 0% 0% / auto padding-box border-box",
        sourceType: "A",
        sourceValKey: "value",
        sourceIdKey: "id",
        isSortable: true,
        emptyField: false,
        noNew: false,
        Source: {},
        URL: false,
        JSONP: true,
        params: {},
        queryParamKey: "query",
        request: function (value, params, func) {
            if (this.URL) {
                $.getJSON(this.URL + (this.JSONP ? '?callback=?' : ''),
                        params,
                        (function (data) {
                            if (typeof (data) == 'string')
                                data = JSON.parse(data);
                            if (this.ResultSuffix != null)
                                var result = data[this.ResultSuffix];
                            else
                                var result = data;
                            var A = [];
                            for (i in result)
                                A.push(result[i])
                            func({Array: A, Sorted: true}, value, value);
                        }).bind(this));
            } else
                func({Array: [], Sorted: true}, value, value);
        },
        prepareParams: function (value, func) {
            // DO SOMETHING WITH PARAMS including query assignment
            var params = this.params
            params[this.queryParamKey] = value;
            this.request(value, params, func)
        },
        matchingValue: function () {
            return this.target.attr("type-a-head-selected-id") !== undefined ? this.target.attr("type-a-head-selected-id") : this.target.val() ? this.target.val() : (this.target.attr("placeholder") ? this.target.attr("placeholder") : '')
        }
//			backgroundTarget:,
//			colorTarget:,
//			borderTarget:,
//			boxShadowTarget:,
//			positionTarget:
//			frameShadowColor :"black",
//			backgroundColor : "white",
//			color : "black",
//			selectedBackgroundColor: "black",
//			selectedColor : "white",
//			accentuationColor: "red",
//			selectedAccentuationColor: "red",
//			linesSeparatorColor: "grey",
    };
    horecaTechTypeAhead.parseHsl = function (color) {
        if (color.toUpperCase().indexOf('RGB') > -1) {
            x0 = color.indexOf("(");
            x1 = color.indexOf(",", x0 + 1);
            x2 = color.indexOf(",", x1 + 1);
            r = parseInt(color.substr(x0 + 1, x1 - x0 - 1));
            g = parseInt(color.substr(x1 + 1, x2 - x1 - 1));
            if (color.toUpperCase().indexOf('RGBA') > -1) {
                x3 = color.indexOf(",", x2 + 1);
                x4 = color.indexOf(")", x3 + 1);
                b = parseInt(color.substr(x2 + 1, x3 - x2 - 1));
                a = parseFloat(color.substr(x3 + 1, x4 - x3 - 1));
            } else {
                x3 = color.indexOf(")", x2 + 1);
                b = parseInt(color.substr(x2 + 1, x3 - x2 - 1));
                a = 1;
            }
            return horecaTechTypeAhead.rgbToHsl({r: r, g: g, b: b, a: a});
        } else if (color.toUpperCase().indexOf('HSL') > -1) {
            x0 = color.indexOf("(");
            x1 = color.indexOf(",", x0 + 1);
            x2 = color.indexOf(",", x1 + 1);
            h = parseInt(color.substr(x0 + 1, x1 - x0 - 1));
            s = parseInt(color.substr(x1 + 1, x2 - x1 - 1));
            if (color.toUpperCase().indexOf('HSLA') > -1) {
                x3 = color.indexOf(",", x2 + 1);
                x4 = color.indexOf(")", x3 + 1);
                l = parseInt(color.substr(x2 + 1, x3 - x2 - 1));
                a = parseFloat(color.substr(x3 + 1, x4 - x3 - 1));
            } else {
                x3 = color.indexOf(")", x2 + 1);
                l = parseInt(color.substr(x2 + 1, x3 - x2 - 1));
                a = 1;
            }
            return {h: h, s: s, l: l, a: a};
        } else if (color.indexOf('#') > -1)
            return horecaTechTypeAhead.hexToHsl(color.toLowerCase())
        else if (horecaTechTypeAhead.stdColor[color])
            return horecaTechTypeAhead.hexToHsl(horecaTechTypeAhead.stdColor[color])
        else
            return horecaTechTypeAhead.hexToHsl('#000000')
    }
    horecaTechTypeAhead.hexToHsl = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var r = parseInt(result[1], 16)
        var g = parseInt(result[2], 16)
        var b = parseInt(result[3], 16)
        return horecaTechTypeAhead.rgbToHsl({r: r, g: g, b: b, a: 1});
    }
    horecaTechTypeAhead.rgbToHsl = function (c) {
        c.r /= 255, c.g /= 255, c.b /= 255;
        var max = Math.max(c.r, c.g, c.b), min = Math.min(c.r, c.g, c.b);
        var h, s, l = (c.r + c.g + c.b) / 0.03;
        if (max == min)
            h = s = 0; // achromatic
        else {
            var d = (max - min);
            s = l > 50 ? d * 100 / (2 - max - min) : d * 100 / (max + min);
            switch (max) {
                case c.r:
                    h = (c.g - c.b) / d + (c.g < c.b ? 6 : 0);
                    break;
                case c.g:
                    h = (c.b - c.r) / d + 2;
                    break;
                case c.b:
                    h = (c.r - c.g) / d + 4;
                    break;
            }
            h = Math.round(h / 6 * 360);
        }
        return {h: h, s: s, l: l, a: c.a};
    }
    horecaTechTypeAhead.build = function (value, valueID) {
        if (valueID == null)
            valueID = this.prevValueID;
        if (this.Source[valueID] != null && (this.prevValue != value || this.Source[valueID].built == null)) {
            var frame = $("#horeca-tech-type-a-head-frame-" + this.ID),
                    container = $('#horeca-tech-type-a-head-container-' + this.ID)
            if (this.prevValueID != null && this.prevValueID != undefined && this.Source[this.prevValueID] != null)
                delete this.Source[this.prevValueID].built;
            this.prevValue = value;
            this.prevValueID = valueID;
            this.Source[valueID].built = true;
            var sourceValKey = (this.Source[valueID].ValKey == null) ? this.sourceValKey : this.Source[valueID].ValKey;
            this.Array = [];
            this.SourceSortKey_ = (this.Source[valueID].SortKey != null) ? this.Source[valueID].SortKey : (this.SourceSortKey != null) ? this.SourceSortKey : sourceValKey;
            this.SourceIdKey_ = (this.Source[valueID].IdKey == null) ? this.sourceIdKey : this.Source[valueID].IdKey;
            this.SourcePutKey_ = (this.Source[valueID].PutKey != null) ? this.Source[valueID].PutKey : (this.SourcePutKey != null) ? this.SourcePutKey : sourceValKey;
            this.SourceType_ = (this.Source[valueID].Type == null) ? this.sourceType : this.Source[valueID].Type;
            if (this.SourceType_ == "A") {
                if (!this.Source[valueID].Sorted && this.Source[valueID].isSortable) {
                    this.Source[valueID].Array.sort()
                    this.Source[valueID].Sorted = true;
                }
                if (value != valueID) {
                    for (a in this.Source[valueID].Array) {
                        var index = this.Source[valueID].Array[a].toLowerCase().indexOf(value.toLowerCase());
                        if (index > -1)
                            this.Array.push({value: this.Source[valueID].Array[a], id: this.Source[valueID].Array[a], index: index});
                    }
                    if (this.Source[valueID].isSortable)
                        this.Array.sort(horecaTechTypeAhead.build.sort_func_index);
                } else
                    for (a in this.Source[valueID].Array)
                        this.Array.push({value: this.Source[valueID].Array[a], id: this.Source[valueID].Array[a], index: this.Source[valueID].Array[a].toLowerCase().indexOf(value.toLowerCase())});
            } else {
                if (!this.Source[valueID].Sorted && this.Source[valueID].isSortable) {
                    this.Source[valueID].Array.sort(horecaTechTypeAhead.build.sort_func.bind(this))
                    this.Source[valueID].Sorted = true;
                }
                if (value != valueID) {
                    for (a in this.Source[valueID].Array) {
                        var index = this.Source[valueID].Array[a][sourceValKey].toLowerCase().indexOf(value.toLowerCase());
                        if (index > -1)
                            this.Array.push({sort: this.Source[valueID].Array[a][this.SourceSortKey_], value: this.Source[valueID].Array[a][sourceValKey], id: this.Source[valueID].Array[a][this.SourceIdKey_], index: index});
                    }
                    if (this.Source[valueID].isSortable)
                        this.Array.sort(horecaTechTypeAhead.build.sort_func_index_sort);
                } else
                    for (a in this.Source[valueID].Array)
                        this.Array.push({value: this.Source[valueID].Array[a][sourceValKey], id: this.Source[valueID].Array[a][this.SourceIdKey_], index: this.Source[valueID].Array[a][sourceValKey].toLowerCase().indexOf(value.toLowerCase())});
            }
            if (this.Array.length == 0) {
                frame.css("display", "none");
                container.empty();
                if (this.isDocking) {
                    this.borderTarget.css({borderBottomLeftRadius: this.borderRadius.Bottom.Left, borderBottomRightRadius: this.borderRadius.Bottom.Right});
                    this.borderTarget.css({borderTopLeftRadius: this.borderRadius.Top.Left, borderTopRightRadius: this.borderRadius.Top.Right});
                }
            } else {
                var str = "", selected = [], matchingValue = this.matchingValue()
                for (var a in this.Array) {
                    if (matchingValue != null && matchingValue != '' && matchingValue == this.Array[a].id)
                        selected.push(a)
                    str += "<p key=\"" + valueID + "\" tg=\"" + this.ID + "\" indx=\"" + a + "\" id=\"horeca-tech-type-a-head-element-" + this.ID + "-" + a + "\" class=\"horeca-tech-type-a-head-element horeca-tech-type-a-head-element-class-" + this.ID + "\">" + ((this.Array[a].index < 0 || !this.isAccentuation) ? this.Array[a].value : (this.Array[a].value.substr(0, this.Array[a].index) + "<span style=\"COLOR:" + this.accentuationColor + "\">" + this.Array[a].value.substr(this.Array[a].index, value.length) + "</span>" + this.Array[a].value.substr(this.Array[a].index + value.length, this.Array[a].value.length - this.Array[a].index - value.length))) + "</p>";
                }
                container.html(str);
                container.css("width", "auto")
                var scr_height = $(window).height(),
                        scr_width = $(window).width();
                frame.css("display", "block");
                frame.width(scr_width);
                var content_height = container.height(),
                        content_height_to_show = Math.min(this.maxLines * this.rowHeight, content_height),
                        border__ = parseInt(frame.css("border-top-width")) + parseInt(frame.css("border-bottom-width"));
                if (scr_height - this.coord.bottom < content_height_to_show + border__) {
                    if (scr_height - this.coord.bottom > this.coord.top) {
                        this.position = 'b';
                        content_height_to_show = scr_height - this.coord.bottom - border__;
                    } else {
                        this.position = 't';
                        content_height_to_show = Math.min(content_height_to_show, this.coord.top - border__);
                    }
                } else
                    this.position = 'b';
                frame.height(content_height_to_show);
                var scrollbarwidth = this.scrollbarwidth * (content_height > content_height_to_show ? 1 : 0)
                this.content_width = Math.max(container.width(), this.width - scrollbarwidth)
                container.css("width", this.content_width)
                var fr_width = this.content_width + scrollbarwidth
                frame.css("width", fr_width);
                if (scr_width - this.coord.left >= fr_width) {
                    frame.css({left: this.coord.left})
                    var l_offset = 0,
                            r_offset = fr_width - this.width;
                } else if (scr_width - this.coord.right >= fr_width) {
                    frame.css({left: this.coord.right - fr_width})
                    var r_offset = 0,
                            l_offset = fr_width - this.width;
                } else {
                    frame.css({left: (scr_width - fr_width) / 2});
                    var l_offset = (scr_width - fr_width) / 2 - this.coord.left,
                            r_offset = (scr_width - fr_width) / 2 - this.coord.right;
                }
                if (this.position == 'b') {
                    frame.css({top: this.coord.bottom});
                    if (this.isDocking) {
                        frame.css({borderTopLeftRadius: Math.min(this.borderRadius.Bottom.Left, Math.max(0, l_offset)), borderTopRightRadius: Math.min(this.borderRadius.Bottom.Right, Math.max(0, r_offset)), borderBottomLeftRadius: this.borderRadius.Top.Left, borderBottomRightRadius: this.borderRadius.Top.Right});
                        this.borderTarget.css({borderBottomLeftRadius: Math.min(this.borderRadius.Bottom.Left, Math.max(0, -l_offset)), borderBottomRightRadius: Math.min(this.borderRadius.Bottom.Right, Math.max(0, -r_offset)), borderTopLeftRadius: this.borderRadius.Top.Left, borderTopRightRadius: this.borderRadius.Top.Right});
                    }
                } else {
                    frame.css({top: this.coord.top - content_height_to_show - border__});
                    if (this.isDocking) {
                        frame.css({borderBottomLeftRadius: Math.min(this.borderRadius.Top.Left, Math.max(0, l_offset)), borderBottomRightRadius: Math.min(this.borderRadius.Top.Right, Math.max(0, r_offset)), borderTopLeftRadius: this.borderRadius.Bottom.Left, borderTopRightRadius: this.borderRadius.Bottom.Right});
                        this.borderTarget.css({borderTopLeftRadius: Math.min(this.borderRadius.Top.Left, Math.max(0, -l_offset)), borderTopRightRadius: Math.min(this.borderRadius.Top.Right, Math.max(0, -r_offset)), borderBottomLeftRadius: this.borderRadius.Bottom.Left, borderBottomRightRadius: this.borderRadius.Bottom.Right});
                    }
                }
                for (var i in selected)
                    $("#horeca-tech-type-a-head-element-" + this.ID + "-" + selected[i]).trigger("mouseover.horeca-tech-type-a-head")
            }

        }
    }
    horecaTechTypeAhead.build.sort_func = function (a, b) {
        if (a[this.SourceSortKey_] < b[this.SourceSortKey_])
            return -1;
        if (a[this.SourceSortKey_] > b[this.SourceSortKey_])
            return 1;
        return 0;
    }
    horecaTechTypeAhead.build.sort_func_index = function (a, b) {
        if (a.index < b.index)
            return -1;
        if (a.index > b.index)
            return 1;
        if (a.value < b.value)
            return -1;
        if (a.value > b.value)
            return 1;
        return 0;
    }
    horecaTechTypeAhead.build.sort_func_index_sort = function (a, b) {
        if (a.index < b.index)
            return -1;
        if (a.index > b.index)
            return 1;
        if (a.sort < b.sort)
            return -1;
        if (a.sort > b.sort)
            return 1;
        return 0;
    }
    horecaTechTypeAhead.getScrollBarWidth = function () {
        var inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";
        var outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild(inner);
        document.body.appendChild(outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        if (w1 == w2)
            w2 = outer.clientWidth;
        document.body.removeChild(outer);
        return (w1 - w2);
    }
    horecaTechTypeAhead.undock = function () {
        if (this.isDocking) {
            this.borderTarget.css({borderBottomLeftRadius: this.borderRadius.Bottom.Left, borderBottomRightRadius: this.borderRadius.Bottom.Right});
            this.borderTarget.css({borderTopLeftRadius: this.borderRadius.Top.Left, borderTopRightRadius: this.borderRadius.Top.Right});
        }
    }
    horecaTechTypeAhead.typing = function (targetID) {
        var this_ = horecaTechTypeAhead.data[targetID],
                value = $('[horeca-tech-type-a-head="' + targetID + '"]').val();
        if (this_ != null) {
            if (this_.Source[value] == null) {
                this_.prepareParams.call(this_, value, (function (result, value, valueID) {
                    this_.Source[valueID] = result;
                    horecaTechTypeAhead.build.call(this_, value, valueID);
                }).bind(this_));
                horecaTechTypeAhead.build.call(this_, value, null);
            } else
                horecaTechTypeAhead.build.call(this_, value, value);
        }
    }
    $(document).scroll(function () {
        $(".horeca-tech-active-type-a-head").trigger("blur.horeca-tech-type-a-head")
    }).on("focus", ".horeca-tech-active-type-a-head", function (e) {
        e.stopPropagation();
        e.cancelBubble = true;
        var targetID = $(this).attr("horeca-tech-type-a-head")
        if ($("#horeca-tech-type-a-head-frame-" + targetID).length == 0) {
            var TAH = horecaTechTypeAhead,
                    template = TAH.dataOpt[targetID],
                    this_ = $.extend(true, {}, template)
            this_.reset = template.reset;
            if (this_.reset)
                this_.reset = this_.reset.bind(this_);
            this_.matchingValue = template.matchingValue.bind(this_);
            this_.prepareParams = template.prepareParams.bind(this_);
            this_.request = template.request ? template.request.bind(this_) : undefined;
            if (this_.noNew) {
                this_.iniValue = this_.matchingValue()
            }
            if (this_.emptyField) {
                this_.placeholder = this_.target.attr('placeholder')
                this_.target.attr('placeholder', this_.target.val())
                this_.target.val("")
            }
            if (this_.container && typeof (this_.container) == 'string')
                this_.container = $(this_.container)
            this_.container.append('<div id="horeca-tech-type-a-head-frame-' + targetID + '" tg="' + targetID + '" class="horeca-tech-type-a-head-frame-class-' + targetID + '"><div id="horeca-tech-type-a-head-container-' + targetID + '" wrap="soft" class="horeca-tech-type-a-head-container-class-' + targetID + '"></div></div>');
            var frame = $("#horeca-tech-type-a-head-frame-" + targetID)
            frame.append("<style>.horeca-tech-type-a-head-frame-class-" + targetID + "{z-index:20;width:auto;height:auto;position:fixed;display:block;overflow-y:auto;overflow-x:hidden} .horeca-tech-type-a-head-container-class-" + targetID + "{background-color:transparent;width:auto;height:auto;top:0;left:0;position:absolute;display:block;overflow:hidden}</style>");
            for (var css_attr in TAH.cssAttrArray)
                this_[css_attr] = template[css_attr] ? template[css_attr] : this_[css_attr + "Target"].css(TAH.cssAttrArray[css_attr]);
            this_.borderRadius = {
                Top: {
                    Left: parseInt(this_.borderTarget.css("border-top-left-radius").substr(0, this_.borderTarget.css("border-top-left-radius").length - 2)),
                    Right: parseInt(this_.borderTarget.css("border-top-right-radius").substr(0, this_.borderTarget.css("border-top-right-radius").length - 2))
                },
                Bottom: {
                    Left: parseInt(this_.borderTarget.css("border-bottom-left-radius").substr(0, this_.borderTarget.css("border-bottom-left-radius").length - 2)),
                    Right: parseInt(this_.borderTarget.css("border-bottom-right-radius").substr(0, this_.borderTarget.css("border-bottom-right-radius").length - 2))
                }
            };
            var css = {}
            for (var cssAttr in  TAH.cssAttrArray)
                if (cssAttr.indexOf("padding") == -1)
                    css[cssAttr] = this_[cssAttr]
            frame.css(css).css({
                borderTopLeftRadius: this_.borderRadius.Bottom.Left,
                borderTopRightRadius: this_.borderRadius.Bottom.Right,
                borderBottomLeftRadius: this_.borderRadius.Top.Left,
                borderBottomRightRadius: this_.borderRadius.Top.Right
            });
            this_.width = this_.widthTarget.width();
            this_.coord = (this_.positionTarget ? this_.positionTarget : this).getBoundingClientRect();
            this_.textShadowColor = (template.textShadowColor == null) ? (this_.textShadow.substr(0, this_.textShadow.indexOf(")") + 1)) : template.textShadowColor;
            this_.backgroundColor = (template.backgroundColor == null) ? this_.backgroundTarget.css("background-color") : template.backgroundColor;
            this_.colorHSLA = TAH.parseHsl(this_.color);
            this_.backgroundColorHSLA = TAH.parseHsl(this_.backgroundColor);
            this_.textShadowColorHSLA = TAH.parseHsl(this_.textShadowColor);
            this_.linesSeparatorColor = (template.linesSeparatorColor == null) ? "HSLA(" + this_.colorHSLA.h + "," + this_.colorHSLA.s + "%," + this_.colorHSLA.l + "%," + (this_.colorHSLA.a * 0.3) + ")" : template.linesSeparatorColor;
            this_.accentuationColor = (template.accentuationColor == null) ? "HSLA(" + ((this_.backgroundColorHSLA.s + this_.colorHSLA.s) > 0 ? Math.round(((this_.colorHSLA.h * this_.colorHSLA.s + this_.backgroundColorHSLA.h * this_.backgroundColorHSLA.s) / (this_.backgroundColorHSLA.s + this_.colorHSLA.s) + 180) % 360) : '0') + ",100%," + (((this_.colorHSLA.l + this_.backgroundColorHSLA.l) / 2 + Math.abs((this_.colorHSLA.l + this_.backgroundColorHSLA.l) / 2 - 100)) / 2) + "%," + this_.colorHSLA.a + ")" : template.accentuationColor;
            this_.selectedColor = (template.selectedColor == null) ? "HSLA(" + this_.colorHSLA.h + "," + this_.colorHSLA.s + "%," + Math.abs(this_.colorHSLA.l - 100) + "%," + this_.colorHSLA.a + ")" : template.selectedColor;
            this_.selectedTextShadow = (template.selectedTextShadow == null) ? ("HSLA(" + this_.textShadowColorHSLA.h + "," + this_.textShadowColorHSLA.s + "%," + Math.abs(this_.textShadowColorHSLA.l - 100) + "%," + this_.textShadowColorHSLA.a + ")" + this_.textShadow.substr(this_.textShadow.indexOf(')') + 1, this_.textShadow.length - this_.textShadow.indexOf(')') - 1)) : template.selectedTextShadow;
            this_.selectedBackgroundColor = (template.selectedBackgroundColor == null) ? "HSLA(" + this_.backgroundColorHSLA.h + "," + this_.backgroundColorHSLA.s + "%," + Math.abs(this_.backgroundColorHSLA.l - 100) + "%," + this_.backgroundColorHSLA.a + ")" : template.selectedBackgroundColor;
            this_.selectedColorHSLA = TAH.parseHsl(this_.selectedColor)
            this_.selectedBackgroundColorHSLA = TAH.parseHsl(this_.selectedBackgroundColor)
            this_.selectedAccentuationColor = (template.selectedAccentuationColor == null) ? "HSLA(" + ((this_.selectedBackgroundColorHSLA.s + this_.selectedColorHSLA.s) > 0 ? Math.round(((this_.selectedColorHSLA.h * this_.selectedColorHSLA.s + this_.selectedBackgroundColorHSLA.h * this_.selectedBackgroundColorHSLA.s) / (this_.selectedBackgroundColorHSLA.s + this_.selectedColorHSLA.s) + 180) % 360) : '0') + ",100%," + (((this_.selectedColorHSLA.l + this_.selectedBackgroundColorHSLA.l) / 2 + Math.abs((this_.selectedColorHSLA.l + this_.selectedBackgroundColorHSLA.l) / 2 - 100)) / 2) + "%," + this_.selectedColorHSLA.a + ")" : template.selectedAccentuationColor;
            this_.rowHeight = this_.target.height() + parseInt(this_.target.css("padding-top")) + parseInt(this_.target.css("padding-bottom")) + ((this_.isLinesSeparator) ? 1 : 0);
            var stylehtml = ".horeca-tech-type-a-head-element-class-" + targetID + " {padding-right:" + this_.paddingRight + ";padding-top:" + this_.paddingTop + ";padding-bottom:" + this_.paddingBottom + ";padding-left:" + this_.paddingLeft + ";max-width:" + $(window).width() + ";margin:0;color:" + this_.color + ";width:auto;overflow:hidden;position:relative;display:block;" + ((this_.isLinesSeparator) ? ("border-top:1px solid " + this_.linesSeparatorColor) : "") + "}";
            var styleTag = $("#httypeahead_style" + targetID)
            if (styleTag.length == 0)
                frame.append("<style id=\"httypeahead_style" + targetID + "\">" + stylehtml + "</style>");
            else
                styleTag.html(stylehtml);
            this_.scrollbarwidth = TAH.getScrollBarWidth()
            this_.unchanged = true
            TAH.data[targetID] = this_
        }
        horecaTechTypeAhead.typing(targetID)
    }).on("keyup", ".horeca-tech-active-type-a-head", function (e) {
        e.stopPropagation();
        var targetID = $(this).attr("horeca-tech-type-a-head")
        if (horecaTechTypeAhead.data[targetID].emptyField) {
            horecaTechTypeAhead.data[targetID].unchanged = false
            $(this).attr("placeholder", "")
        }
        horecaTechTypeAhead.typing(targetID)
    }).on("blur.horeca-tech-type-a-head", ".horeca-tech-active-type-a-head", function (e) {
        e.stopPropagation();
        var elm = $(this), this_
        if (elm.length && elm.attr("horeca-tech-type-a-head") && (this_ = horecaTechTypeAhead.data[elm.attr("horeca-tech-type-a-head")])) {
            $("#horeca-tech-type-a-head-frame-" + this_.ID).remove();
            horecaTechTypeAhead.undock.call(this_)
            if (this_.emptyField) {
                if (this_.unchanged)
                    this_.target.val(this_.target.attr("placeholder"))
                if (this_.placeholder !== undefined)
                    this_.target.attr("placeholder", this_.placeholder)
                else
                    this_.target.removeAttr("placeholder")
            }
            if (this_.noNew) {
                if (this_.reset) {
                    this_.reset(this_.target, this_.iniValue);
                } else if (this_.onClose)
                    this_.onClose(this_.target, {status: "cancel", iniValue: this_.iniValue})
            } else if (this_.onCancel != null && typeof (this_.onCancel) == 'function')
                this_.onCancel(this_.target, this_.iniValue);
            delete horecaTechTypeAhead.data[this_.ID];
        }
    }).on("mouseout", ".horeca-tech-active-type-a-head", function () {
        var targetID = $(this).attr("horeca-tech-type-a-head")
        if (targetID)
            $(".horeca-tech-type-a-head-element-class-" + targetID).trigger("mouseout.horeca-tech-type-a-head")
    }).on("mouseout.horeca-tech-type-a-head", ".horeca-tech-type-a-head-element", function () {
        var elm = $(this), this_
        if (elm.length && elm.attr('tg') && (this_ = horecaTechTypeAhead.data[elm.attr('tg')])) {
            elm.find('span').css({color: this_.accentuationColor})
            elm.css({backgroundColor: "transparent", color: this_.color, textShadow: this_.textShadow});
        }
    }).on("mouseover.horeca-tech-type-a-head", ".horeca-tech-type-a-head-element", function () {
        var elm = $(this), this_
        if (elm.length && elm.attr('tg') && (this_ = horecaTechTypeAhead.data[elm.attr('tg')])) {
            elm.find('span').css({color: this_.selectedAccentuationColor})
            elm.css({backgroundColor: this_.selectedBackgroundColor, color: this_.selectedColor, textShadow: this_.selectedTextShadow});
        }
    }).on("mousedown", ".horeca-tech-type-a-head-element", function (e) {
        e.stopPropagation();
        var elm = $(this), this_
        if (elm.length && elm.attr('tg') && (this_ = horecaTechTypeAhead.data[elm.attr('tg')])) {
            $("#horeca-tech-type-a-head-frame-" + this_.ID).remove();
            var index = elm.attr("indx"),
                    valueID = elm.attr("key");
            horecaTechTypeAhead.undock.call(this_)
            if (this_.emptyField) {
                if (this_.placeholder !== undefined)
                    this_.target.attr("placeholder", this_.placeholder)
                else
                    this_.target.removeAttr("placeholder")
            }
            if (this_.SourcePutKey_)
                this_.target.val((this_.SourceType_ == "A") ? this_.Source[valueID].Array[index] : this_.Source[valueID].Array[index][this_.SourcePutKey_]);
            if (this_.onClose != null && typeof (this_.onClose) == 'function')
                this_.onClose(this_.target, $.extend(this_.Array[index],{'status':'close'}), this_.SourceType_, this_.SourceIdKey_, this_.SourcePutKey_);
            delete horecaTechTypeAhead.data[this_.ID];
        }
    });
    $.fn.HorecaTechTypeaheadOff = function () {
        $(this).removeClass("horeca-tech-active-type-a-head");
        delete horecaTechTypeAhead.dataOpt[$(this).attr("horeca-tech-type-a-head")];
    };
    $.fn.HorecaTechTypeahead = function (opt) {
        var TAH = horecaTechTypeAhead
        if ($(this).attr("horeca-tech-type-a-head") == null) {
            $(this).attr("horeca-tech-type-a-head", TAH.counter++);
        }
        $(this).addClass("horeca-tech-active-type-a-head");
        var targetID = $(this).attr("horeca-tech-type-a-head")
        // первоначальная копия дефолтных значений в создаваемый шаблон
        if (TAH.dataOpt[targetID] == null) {
            TAH.dataOpt[targetID] = $.extend(true, {}, TAH.options);
            TAH.dataOpt[targetID].reset = TAH.options.reset;
            TAH.dataOpt[targetID].matchingValue = TAH.options.matchingValue;
            TAH.dataOpt[targetID].prepareParams = TAH.options.prepareParams;
            TAH.dataOpt[targetID].request = TAH.options.request;
        }
        TAH.dataOpt[targetID].target = $(this);
        TAH.dataOpt[targetID].ID = targetID

// наложение импортируемых на шаблон 
        TAH.dataOpt[targetID] = $.extend(true, TAH.dataOpt[targetID], opt);
        if (opt.request != null)
            TAH.dataOpt[targetID].request = opt.request;
        if (opt.reset != null)
            TAH.dataOpt[targetID].reset = opt.reset;
        if (opt.matchingValue != null)
            TAH.dataOpt[targetID].matchingValue = opt.matchingValue;
        if (opt.prepareParams != null)
            TAH.dataOpt[targetID].prepareParams = opt.prepareParams;
        TAH.dataOpt[targetID].prevValue = null;
        TAH.dataOpt[targetID].prevValueID = "";
        if (TAH.dataOpt[targetID].borderTarget && typeof (TAH.dataOpt[targetID].borderTarget) == 'string')
            TAH.dataOpt[targetID].borderTarget = $(TAH.dataOpt[targetID].borderTarget)
        if (TAH.dataOpt[targetID].widthTarget && typeof (TAH.dataOpt[targetID].widthTarget) == 'string')
            TAH.dataOpt[targetID].widthTargett = $(TAH.dataOpt[targetID].widthTarget)
        if (TAH.dataOpt[targetID].backgroundTarget && typeof (TAH.dataOpt[targetID].backgroundTarget) == 'string')
            TAH.dataOpt[targetID].backgroundTarget = $(TAH.dataOpt[targetID].backgroundTarget)
        TAH.dataOpt[targetID].borderTarget = (TAH.dataOpt[targetID].borderTarget && TAH.dataOpt[targetID].borderTarget.length != 0) ? TAH.dataOpt[targetID].borderTarget : TAH.dataOpt[targetID].target;
        TAH.dataOpt[targetID].widthTarget = (TAH.dataOpt[targetID].widthTarget && TAH.dataOpt[targetID].widthTarget.length != 0) ? TAH.dataOpt[targetID].widthTarget : TAH.dataOpt[targetID].target;
        for (var css_attr in TAH.cssAttrArray) {
            if (TAH.dataOpt[targetID][css_attr + "Target"] && typeof (TAH.dataOpt[targetID][css_attr + "Target"]) == 'string')
                TAH.dataOpt[targetID][css_attr + "Target"] = $(TAH.dataOpt[targetID][css_attr + "Target"])
            TAH.dataOpt[targetID][css_attr + "Target"] = (TAH.dataOpt[targetID][css_attr + "Target"] && TAH.dataOpt[targetID][css_attr + "Target"].length != 0) ? TAH.dataOpt[targetID][css_attr + "Target"] : TAH.dataOpt[targetID].target
        }
    };
}(jQuery));
