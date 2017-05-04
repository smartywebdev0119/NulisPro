import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Vendor */
import { Modal } from 'react-bootstrap';
import StripeCheckout from 'react-stripe-checkout';

/* Actions */
import * as actions from '../actions/profiles';


class PaymentsModal extends Component {
    render() {
	return (
	    <Modal className="upgrade"
		   show={this.props.show}
		   onHide={this.props.onHide}>
		<Modal.Header closeButton>
		    <h1>Upgrade Account</h1>
		</Modal.Header>
		<div className="panel-modal">
		    <p>You are currently using a free version of Nulis,
			which allows you to create up to 100 cards per month.</p>
		    <p>Nulis has launched only recently, so as an early adopter
			you can purchase the unlimited lifetime account for only 
			<b> $20</b>.</p>
		    <p>Thank you for your support!
			It helps me to cover the server costs,
			and spend more time making Nulis more awesome.</p>

		    <div className="panel-pricing">
			<h2>Nulis Unlimited</h2>
			<StripeCheckout token={this.props.payment}
					stripeKey="pk_test_C93OCodn01Awd4AzCXugSfVL"
					name="Nulis"
					description="Tree editor for writers"
					panelLabel="Upgrade"
					amount={2000}
					currency="USD"
					allowRememberMe={false}
					email={localStorage.getItem('email')}
					image="https://nulis.io/media/logo.png">
			    <a className="btn right">Upgrade</a>
			</StripeCheckout>
			<div className="clearfix"></div>

		    </div>
		    {/*  
			<div className="panel-pricing">
			<h2>Free</h2>
			<a className="btn">Share</a>
			</div>
		      */}
		</div>
	    </Modal>

	)
    }
}

function mapStateToProps(state) {
    return {
    	authenticated: state.profiles.authenticated
    };
}

export default connect(mapStateToProps, actions)(PaymentsModal);
