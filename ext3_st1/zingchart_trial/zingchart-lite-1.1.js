zingchart = {

    sOutput : 'flash',
    
    bFirefoxStyle : false,
    
    oPrintStyle: null,
    
    liburl: 'zingchart.swf',
    
	oData : {},

	oDefaults : {},
	
	oIds : {},
	
	bPreserveContainer: false,

	alert : function(sValue) {
		alert(sValue);
	},

	jsdatafunc : function(sJson) {
		var oResponse = eval('(' + sJson + ')');
		var sId = oResponse['id'] || '';
		return zingchart.oData[sId];
	},

	jsdefaultsfunc : function(sJson) {
		var oResponse = eval('(' + sJson + ')');
		var sId = oResponse['id'] || '';
		return zingchart.oDefaults[sId];
	},

	setData : function(sId, sData) {
		zingchart.oData[sId] = sData;
	},

	getData : function(sId) {
		return zingchart.oData[sId] || '';
	},
	
	exec : function(sId, sFunction, sData) {
		return zingchart.exec_flash(sId, sFunction, sData);
	},

	exec_flash : function(sId, sFunction, sData) {
	    var sFlashId = zingchart.oIds[sId];
	    if (sFunction == "destroy"){
	       zingchart.destroy_flash(sFlashId);
	    }
	    else if (sFunction == "getrender"){
	        return "flash";
	    }
	    else{
	       return document.getElementById(sFlashId).zcExec(sFunction, sData);
	    }
	},
	
    isIE: function(){
        return /(msie|internet explorer)/i.test(navigator.userAgent);
    },
    
	initFirefoxImage: function(){
	    var head = document.getElementsByTagName('head');
    	head = ((head.length != 1) ? null : head[0]);
    	
    	style = document.createElement('style');
    	style.setAttribute('type','text/css');
    	style.setAttribute('media','screen');
    	style.appendChild(document.createTextNode('.zingchart_screen' + '{display:none;}'));
    	head.appendChild(style);
    	
    	zingchart.oPrintStyle = document.createElement('style');
    	zingchart.oPrintStyle.setAttribute('type','text/css');
    	zingchart.oPrintStyle.setAttribute('media','print');
    	zingchart.oPrintStyle.appendChild(document.createTextNode('.zingchart_screen' + '{display:block;}'));
    	head.appendChild(zingchart.oPrintStyle);
    	zingchart.bFirefoxStyle = true;
	},
	
	printFirefoxImage: function(sId, imgData, width, height) {
        var sFlashId = zingchart.oIds[sId];
        
        if (!zingchart.bFirefoxStyle){
            zingchart.initFirefoxImage();
        }
        
        zingchart.oPrintStyle.appendChild(document.createTextNode('#' + sFlashId + '{visibility:hidden;}'));
	    
	    var obj = document.getElementById(sId);
    	var position = zingchart.getPosition(obj);
    	
    	var needAppend = false;
    	var img = document.getElementById(sId+"_screen");
    	if (img == null) {
    		img = document.createElement('img');
    		needAppend = true;
    	}
    	
    	img.id = sId+"_screen";
    	img.className = "zingchart_screen";
    	img.style.width = width + "px";
    	img.style.height = height + "px";
    	img.style.position = "absolute";
    	img.style.left = position[0] + "px";
    	img.style.top = position[1] + "px";
    	img.style.padding = 0;
    	img.style.margin = 0;
    	img.style.border = 0;
    	img.src = 'data:image/png;base64,'+imgData;
    	if (needAppend){
    		document.body.appendChild(img);
    	}
    },
    
    getPosition : function(obj) {
    	var curleft = curtop = 0;
    	if (obj.offsetParent) {
            do {
    			curleft += obj.offsetLeft;
    			curtop += obj.offsetTop;
    		} while (obj = obj.offsetParent);
    	}
    	return [curleft,curtop];	
    },
    
    destroy_flash : function (sId){
        var div = null;
        if (!zingchart.bPreserveContainer){
            var flash = document.getElementById(sId);
            div = document.createElement('div');
		    flash.parentNode.insertBefore(div, flash);
        }
        
        swfobject.removeSWF(sId);   
        if (div){ 
            div.id = sId;
        }
    },
    
	render : function(oOptions) {
		zingchart.render_flash(oOptions);
	},

	render_flash : function(oOptions) {
		oOptions = oOptions || {};
		
		var sId = oOptions['id'] || oOptions['container'] || ('zingchart' + parseInt(9999*Math.random(), 10));
		zingchart.bPreserveContainer = oOptions['preservecontainer'] || false;
		var sWidth = oOptions['width'] || 480;
		var sHeight = oOptions['height'] || 320;
		var sBgColor = oOptions['bgcolor'] || '0xffffff';
		if (sWidth == 'auto') {
			sWidth = '100%';
		}
		if (sHeight == 'auto') {
			sHeight = '100%';
		}
		var sLibUrl = oOptions['liburl'] || zingchart.liburl;
		var sDataUrl = oOptions['dataurl'] || '';
		var sDefaultsUrl = oOptions['defaultsurl'] || '';
		var sJsDataFunc = oOptions['jsdatafunc'] || '';
		var sJsDefaultsFunc = oOptions['jsdefaultsfunc'] || '';
		var sWMode = oOptions['wmode'] || '';
		var sData = oOptions['data'] || '{"graphset":[]}';
		sData = (sData.replace(/(\s)/,'')=='')?'{}':sData;
		var oFlashVars = oOptions['flashvars'] || {};
		var sPath = sLibUrl.substring(0, (sLibUrl.lastIndexOf("/") + 1));
		var sExpressInstallUrl = oOptions['expressinstallurl'] || sPath + 'expressInstall.swf';
		
		for (key in oOptions)
        {
            if (key == "allowlocal" || key == "exportdataurl" || key == "exportimageurl" || key == "exportpdfurl" || key == "errormessage" 
             || key == 'customprogresslogo' || key == 'hideprogresslogo' || key == 'hideprogressbar')
             
             oFlashVars[key] = oOptions[key];
        }

		oFlashVars['url'] = escape(sDataUrl);
		oFlashVars['jsobjectid'] = escape(sId);
		oFlashVars['bgcolor'] = escape(sBgColor);

		if (sDefaultsUrl != '') {
			oFlashVars['defaultsurl'] = escape(sDefaultsUrl);
		}
		if (sData != '{"graphset":[]}') {
			oFlashVars['jsdatafunc'] = 'zingchart.jsdatafunc';
			zingchart.oData[sId] = sData;
		}
		if (sJsDataFunc != '') {
			oFlashVars['jsdatafunc'] = sJsDataFunc;
		}
		if (sJsDefaultsFunc != '') {
			oFlashVars['jsdefaultsfunc'] = sJsDefaultsFunc;
		}

		oFlashVars['baseurl'] = escape(window.location.href);

		var sFlashId;
		if (zingchart.bPreserveContainer){
		    var div = document.createElement('div');
		    div.style.width = "100%";
		    div.style.height = "100%";
		    sFlashId = div.id = sId + "zingchart_holder";
            
		    var obj = document.getElementById(sId);
		    if (obj.hasChildNodes()){
                while (obj.childNodes.length > 0){
                    obj.removeChild(obj.firstChild);       
                } 
            }
		    obj.appendChild(div);
		}
		else{
		    sFlashId = sId;
		}
		
		zingchart.oIds[sId] = sFlashId;
		
		var oParameters = {
			'allowScriptAccess' : 'always',
			'allowFullScreen' : 'true',
			'id' : sId,
			'name' : sId,
			'movie' : 'zingchart.swf'
		};
		
		if (sWMode != ''){
		    oParameters['wmode'] = sWMode;
		}
		
		var oAttributes = {};
		swfobject.embedSWF(
			sLibUrl,
			sFlashId,
			sWidth,
			sHeight,
			'10',
			sExpressInstallUrl,
			oFlashVars,
			oParameters,
			oAttributes
		);
	}

};
	
