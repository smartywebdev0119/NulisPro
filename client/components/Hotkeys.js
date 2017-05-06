import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ActionCreators } from 'redux-undo';
var { undo, redo } = ActionCreators;

/* Vendor components */
import Mousetrap from 'mousetrap';

/* Actions */
import * as actions from '../actions/index';

class Hotkeys extends Component {
    componentDidMount(){
	/* 
	Mousetrap(document.body).bind(['alt+f'], ()=>{
	    console.log("yes");
	    return false;
	});
	*/
	/* Editing */
	Mousetrap(document.body).bind(['enter'], ()=>{
	    if (!this.props.tree.editing) {
		this.props.setEditing(true);
	    }
	    return false;
	});
	Mousetrap(document.body).bind(['esc'], ()=>{
	    this.props.setEditing(false);
	    return false;
	});

	Mousetrap(document.body).bind(['ctrl+enter'], ()=>{
	    console.log("Editing mode!");
	    this.props.setEditing(!this.props.tree.editing);
	    return false;
	});

	/* Select */
	Mousetrap(document.body).bind(['ctrl+j', 'ctrl+down'], ()=>{
	    this.props.selectCard('down');
	    return false;
	});

	Mousetrap(document.body).bind(['ctrl+k','ctrl+up'], ()=>{
	    this.props.selectCard('up');
	    return false;
	});
	Mousetrap(document.body).bind(['ctrl+h', 'ctrl+left'], ()=>{
	    this.props.selectCard('left');
	    return false;
	});
	Mousetrap(document.body).bind(['ctrl+l', 'ctrl+right'], ()=>{
	    this.props.selectCard('right');
	    return false;
	});
	/* Create */
	Mousetrap(document.body).bind(['ctrl+shift+l', 'ctrl+shift+right'], ()=>{
	    this.props.createCard("right");
	    return false;
	});
	Mousetrap(document.body).bind(['ctrl+shift+k', 'ctrl+shift+up'], ()=>{
	    this.props.createCard("before");
	    return false;
	});
	Mousetrap(document.body).bind(['ctrl+shift+j', 'ctrl+shift+down'], ()=>{
	    this.props.createCard("after");
	    return false;
	});
	/* Move */
	Mousetrap(document.body).bind(['alt+j', 'alt+down'], ()=>{
	    this.props.moveCard("down");
	    return false;
	});
	Mousetrap(document.body).bind(['alt+k', 'alt+up'], ()=>{
	    this.props.moveCard("up");
	    return false;
	});
	Mousetrap(document.body).bind(['alt+l', 'alt+right'], ()=>{
	    this.props.moveCard("right");
	    return false;
	});
	Mousetrap(document.body).bind(['alt+h', 'alt+left'], ()=>{
	    this.props.moveCard("left");
	    return false;
	});		
	/* Edit */
	/* 
	   Mousetrap(document.body).bind(['enter'], ()=>{
	   this.props.setEditing(true);
	   return false;
	   });
	 */
	/* Save */
	/* 
	Mousetrap(document.body).bind(['ctrl+s'], ()=>{
	    this.props.updateTree(this.props.tree.present);
	    return false;
	});
	*/

	/* Delete */
	Mousetrap(document.body).bind(['ctrl+backspace'], ()=>{
	    this.props.deleteCard();
	    return false;
	});

	/* Undo/Redo */
	Mousetrap(document.body).bind(['ctrl+z'], ()=>{
	    this.props.undo();
	    return false;
	});
	Mousetrap(document.body).bind(['ctrl+shift+z'], ()=>{
	    this.props.redo();
	    return false;
	});

	/* Edit card color */
	/* Edit card color */
	Mousetrap(document.body).bind(['alt+c'], ()=>{
	    this.props.setCardConfig(!this.props.tree.showCardConfig);
	    return false;
	});
	/* Unbind */
	/* Mousetrap.unbind('tab.form-control');*/
	

    }

    componentWillUnmount() {
	/* unbindHotkeys();*/
    }
    
    render() {
	return null;
    }
}


function mapStateToProps(state) {
    return { tree: state.tree.present };
}

export default connect(mapStateToProps, actions)(Hotkeys);

