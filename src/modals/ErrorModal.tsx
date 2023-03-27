import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Form} from '../form';
import {AppModal} from '.';

import {clearError, selectErrors} from '../store/error';

function strToHtml(s: string) {
	return s
		.split('<')
		.join('&lt;')
		.split('>')
		.join('&gt;')
		.split('\n')
		.join('<br />')
}

function ErrorModal() {
	const dispatch = useDispatch();
	const errors = useSelector(selectErrors);
	const errMsg = errors.length? errors[0]: null;

	let summary = '',
		detail = '';
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
				submit={() => dispatch(clearError())}
			>
				{detail && <p dangerouslySetInnerHTML={{__html: strToHtml(detail)}} />}
			</Form>
		</AppModal>
	)
}

export default ErrorModal;
