import React, { Component } from 'react';
import { connect } from 'react-redux';

import Mousetrap from 'mousetrap';
import Remarkable from 'remarkable';

/* Actions */
import * as cardsActions from '../actions/cards.actions';
import {updateSearchQuery} from '../actions/trees.actions';

/* Vendor components */
import SimpleMDE from 'react-simplemde-editor';


function bindCheckboxes(cardId){
    /* After markdown has rendered, grab the checkboxes */
    var checkboxes = document.getElementsByClassName(cardId);
    checkboxes = [].slice.call(checkboxes);
    if (checkboxes.length) {
	/* And assign the onclick function */
	checkboxes.map((c, i)=>{
	    c.onclick = ()=> {
		/* Action that tells reducer to check/uncheck markdown checkbox */
		this.props.checkCheckbox(i+1, c.id);
	    }
	});
    }
}

function bindTags(cardId, query){
    /* After markdown has rendered, grab the tags */
    var tags = document.getElementsByClassName("tag-"+cardId);
    tags = [].slice.call(tags);
    if (tags.length) {
	/* And assign the onclick function */
	tags.map((c, i)=>{
	    c.onclick = (event)=> {
		var tag = event.target.innerHTML;
		/* console.log("Tag " + tag);*/
		/* console.log("Query " + tag);		*/
		if (query.includes(tag)) {
		    this.props.updateSearchQuery(query.replace(tag,"").trim());
		} else {
		    var queryWithTag = query + " " + tag;
		    this.props.updateSearchQuery(queryWithTag.trim());
		}

	    }
	});
    }
}

class Editor extends Component {
    constructor(props){
	super(props);
	bindCheckboxes = bindCheckboxes.bind(this);
	bindTags = bindTags.bind(this);		
    }

    componentDidMount(){
	if (this.props.card.id == this.props.tree.activeCard
	    && this.editor && document.activeElement.className != "search") {
	    /* If the card is active - focus on editor. */
	    this.editor.simplemde.codemirror.focus();
	    /* And move the cursor to the end. */
	    this.editor.simplemde.codemirror.setCursor(4);
	    /* console.log(this.editor.simplemde.codemirror);*/
	}
	/* this.editor.simplemde.codemirror.options.extraKeys['Ctrl-Z'] = false; */

	/* Split */
	Mousetrap(document.body).bind(['ctrl+alt+j'], ()=>{
	    var cursor = this.editor.simplemde.codemirror.getCursor();
	    var doc = this.editor.simplemde.codemirror.getDoc();
	    var beforeCursor = doc.getRange({line:0,ch:0}, cursor);
	    var afterCursor = doc.getRange(cursor, {line:1000,ch:1000});	    
	    console.log("after " + afterCursor);
	    return false;
	});

	/* Attaching events to checkboxes after rendering */
	const { card } = this.props;
	var { query } = this.props.tree;
	if (!query) {
	    query = "";
	}
	bindCheckboxes(card.id);
	bindTags(card.id, query);
    }

    componentDidUpdate(prevProps){
	if (this.editor) {
	    /* Unbind tab */
	    this.editor.simplemde.codemirror.options.extraKeys['Tab'] = false;
	    this.editor.simplemde.codemirror.options.extraKeys['Ctrl+Enter'] = false;
	    /* Experimenting with getting and setting a cursor.
	       Use it to save cursor position, or bind emacs hotkeys!! */
	    /*
	       var cursor = this.editor.simplemde.codemirror.getCursor();
	       cursor.ch = 300;
	       this.editor.simplemde.codemirror.setCursor(cursor);
	     */
	    if (this.props.card.id == this.props.tree.activeCard
		&& document.activeElement.className != "search") {
		/* Every time I switch a card - focus the editor */
		this.editor.simplemde.codemirror.focus();
	    }
	    if (this.props.card.id == this.props.tree.activeCard &&
		this.props.tree.activeCard !== prevProps.tree.activeCard &&
		this.editor.simplemde.codemirror.getCursor().ch == 0) {
		/* If I have switched cards, and this card is active,
		   and the cursor is at the beginning - move cursor to the end. */
		    this.editor.simplemde.codemirror.setCursor(4);	   
	    }
	} else {
	    /* Reattaching events to checkboxes after updating */
	    const { card } = this.props;
	    var { query } = this.props.tree;
	    if (!query) {
		query = "";
	    }
	    bindCheckboxes(card.id);
	    bindTags(card.id, query);
	}
    }

    renderMarkdown(markdown) {
	const { card } = this.props;
	/* Turn markdown into html */
	const md = new Remarkable({
	    html: true,
	    xhtmlOut: true,
	    breaks: true,
	    linkify: true
	});

	/* Highlight text */
	function highlight(str, find) {
	    var regexp = new RegExp(find, 'ig');
	    return str.replace(regexp, (match)=>{
		return `<span class="highlighted">${match}</span>`;
	    });
	}
	var query = this.props.tree.query;
	if (query) {
	    markdown = highlight(markdown, query);
	}
	
	/* Render checkboxes */
	var checkboxRegexp = new RegExp(/\[ \]/, 'ig');
	markdown = markdown.replace(checkboxRegexp,
				    `<span class="checkbox ${card.id}" id=${card.id}></span>`);
	checkboxRegexp = new RegExp(/\[(X|V|v)\]/, 'ig');
	markdown = markdown.replace(checkboxRegexp,
				    `<span class="checkbox ${card.id} checked" id=${card.id}></span>`);	

	/* Render tags */
	var tagsRegexp = new RegExp(/(\#[a-z\d-]+\b)/, 'ig');
	markdown = markdown.replace(tagsRegexp, (match)=>
	    `<span class="tag tag-${card.id}">${match}</span>`);

	var html = md.render(markdown);
	/* Collapse */
	if (false) {
	    var firstLine = html.split('\n')[0];
	    html = firstLine+"<div class='btn collapsed'><i class='fa fa-ellipsis-h'></i></div>";
	}
	return (
	    <div dangerouslySetInnerHTML={{__html:html}} />
	);
    }


    render() {
	const { card } = this.props;
	/* if edit all, or editing this one,  */
	return (
	    <div onClick={() =>this.props.setActiveCard(card.id)}>
   	{ this.props.tree.editing ? 
	     <SimpleMDE
		 ref={(input) => { this.editor = input; }} 
		 value={card.content}
		 id={"editor-"+card.id}
		 className="text-editor mousetrap"
		 value={card.content}
		 onChange={(value) => {
			 if (value != card.content) {
			     {/* console.log("Change!") */}
			     this.props.updateCard(card, value)
			 }
		     }}
		 options={{
		     spellChecker: false,
		     height: 10,
		     autofocus: false,
		     shortcuts: {
			 "toggleFullScreen": "Alt-F",
			 "drawLink": null // unbind Ctrl+K
		     },
		     status: false,
		     placeholder: "Write here...",
		     initialValue: card.content
		 }}/>
           :
	      <div className="text-editor text-inactive">
		  {this.renderMarkdown(card.content)}
	      </div>
	   }

	    </div>

	)
    }
}



/* Magic connecting component to redux */
function mapStateToProps(state) {
    return { tree: state.tree.present }
}
/* First argument allows to access state */
/* Second allows to fire actions */
export default connect(mapStateToProps, {...cardsActions, updateSearchQuery})(Editor);
