/* global rtp navigator */
let rtp_ready = false;
class RTPCMap {
  stack = [];constructor() {/* empty */} get stack() { return this.stack; }
  appendStack(score, position, name) {
  	if(score && position && name){ this.stack.push([score, position.trim(), name.trim()]); }
  	if( this.stack.length > 1 && !rtp_ready ){ rtp_ready = true; }
  }
}
let rtp_map = new RTPCMap();
let campaignCallback = function( campaign, id ){
	rtp_map.appendStack(campaign['priorityScore'], campaign['reactionName'].split('-')[0].trim(), campaign['reactionName'].split('-')[1].trim());
}

rtp('get', 'campaign', campaignCallback);
