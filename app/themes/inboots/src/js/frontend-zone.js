/* global jQuery  */
let SegmentTiles = function( options, fallback ){
	let vars = {};
	let root = this;
	let zoneID;
	let fallbackID = fallback;
	let t;
	let campaignSet;
	let iter;
	let loaded;
	this.construct = function( options ) {
        // $.extend(vars , options);
        root.zoneID = options;
        root.t = 355;
        root.iter = 0;
        root.campaignSet = [];
        root.loaded = false;
		setTimeout(function(){
			root.callCampaign(root.zoneID);
		}, 800);
    };
    
    this.insertAfter = function( newNode, existingNode) {
    	existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }
    
    this.catchEvent = function ( ) {
		let msg = "-- Loading default block --";
		window.console.log('%c [NWEA] ' + msg, 'background: #414142; color: #fec10d');	
		root.load_alternative_block();
    };
    
    this.load_alternative_block = function ( ) {
		let elContainer = document.querySelector('.fw_zone[data-zone-id="' + root.zoneID + '"]');
		let temp = elContainer.nextElementSibling;
		let clon = temp.content.cloneNode(true);
		// elContainer.appendChild(clon);
		root.insertAfter(clon, elContainer);
		elContainer.style.display = "none";
    };
    
    this.processResult = function ( moduleName ) {
  		let detected = false;
		
		  jQuery.ajax({
			type: "GET",
			dataType: "json",
			url: `/wp-json/wp/v2/reusable-blocks/?blockname=${moduleName}&blockid=${fallbackID}`, 
			success: function(result){
				detected = true;
				jQuery(`div[data-zone-id="${root.zoneID}"]`).after( result )
			},
			error: function(){
				let msg = "No .ORG block found with the name of \"" + moduleName + '\"';
				window.console.log('%c [NWEA] ' + msg, 'background: #414142; color: #fec10d');	
				root.load_alternative_block();
			}
		});
    };

    this.callCampaign = function ( zoneID ) {
    	/* global rtp_map */
		let pos_match = [];
		let priority_match = [];
		rtp_map.stack.forEach(function(item,i,arr){
			if( item[1] == zoneID ){
				pos_match.push(item);
			} 
		});
		if(pos_match.length >= 1){
			priority_match = pos_match[0];
			pos_match.forEach(function(item){
				if(priority_match[0] <= item[0]){
					priority_match = item;
				}
			});
		}
		let moduleName;
		if(Array.isArray(priority_match) && priority_match[0]){
			moduleName = priority_match[2]
			loaded = true;
			root.loaded = true;
		}
		root.processResult( moduleName );
		if( root.loaded == false ){
			root.catchEvent();
			root.loaded = true;
		}
    };
    
	root.construct(options);
}

