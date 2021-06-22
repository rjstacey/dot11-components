import React from 'react'
import {connect} from 'react-redux'
import {Form} from '../general/Form'
import AppModal from './AppModal'

import {clearError} from '../store/error'

function strToHtml(s) {
	return s
		.split('<')
		.join('&lt;')
		.split('>')
		.join('&gt;')
		.split('\n')
		.join('<br />')
}

function ErrorModal({errMsg, clearError}) {
	let summary, detail;
	if (errMsg) {
		summary = errMsg.summary;
		if (errMsg.detail)
			detail = errMsg.detail;
	}
	return (
		<AppModal
			isOpen={errMsg !== null}
			onRequestClose={clearError}
		>
			<Form
				title={summary}
				submit={clearError}
			>
				{detail && <p dangerouslySetInnerHTML={{__html: strToHtml(detail)}} />}
			</Form>
		</AppModal>
	)
}

export default connect(
	(state) => ({
		errMsg: state.errMsg.length? state.errMsg[0]: null
	}),
	{clearError}
)(ErrorModal)