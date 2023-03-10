import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {Form} from '../form';
import {AppModal} from '.';

import {clearError, ErrorMsgState} from '../store/error';

function strToHtml(s: string) {
	return s
		.split('<')
		.join('&lt;')
		.split('>')
		.join('&gt;')
		.split('\n')
		.join('<br />')
}

const connector = connect(
	(state) => {
		const errMsgState = state['errMsg'] as ErrorMsgState;
		const errMsg = errMsgState.length? errMsgState[0]: null;
		return {errMsg}
	},
	{clearError}
);

type ErrorModalProps = ConnectedProps<typeof connector>;

function ErrorModal({errMsg, clearError}: ErrorModalProps) {
	let summary: string = '',
		detail: string = '';
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

export default connector(ErrorModal);
