import PropTypes from 'prop-types'
import React from 'react'
import styled from '@emotion/styled'
import {Handle} from '../lib/icons'

import Dropdown from './Dropdown'
import {logout, AccessLevelOptions} from '../lib/user'

const AccountSummaryContainer = styled.div`
	display: flex;
	align-items: center;
	:hover {
		color: tomato;
	}
	span {
		margin-right: 5px;
	}
`;

const AccountSummary = ({user, isOpen, open, close}) =>
	<AccountSummaryContainer
		onClick={() => isOpen? close(): open()}
	>
		<span>{`${user.Name} (${user.SAPIN})`}</span>
		<Handle open={isOpen} />
	</AccountSummaryContainer>

const Button = styled.button`
	height: 36px;
	text-align: center;
	width: 100%;
	border-radius: 3px;
	cursor: pointer;
	transition: all 0.6s ease 0s;
	white-space: nowrap;
	vertical-align: middle;
	background-color: rgb(255, 255, 255);
	border: 1px solid rgb(235, 235, 235);
	color: rgb(51, 51, 51);
	font-size: 11px;
	line-height: 11px;
	font-weight: 500;
	letter-spacing: 0.02em;
	padding: 11px 12px 8px;
	text-transform: uppercase;
	:hover {background-color: #fafafa}
`;

const SignOutForm = ({user, close}) => {
	
	const submit = async () => {
		await logout();
		if (close)
			close();
	}

	const accessOption = AccessLevelOptions.find(o => o.value === user.Access);
	const accessLabel = accessOption? accessOption.label: 'Unknown';

	return (
		<>
			<label>{user.Name}</label>
			<label>{user.SAPIN}</label>
			<label>{user.Username}</label>
			<label>{accessLabel}</label>
			<Button value="Sign Out" onClick={submit}>Sign out</Button>
		</>
	)
}

const Account = ({user}) =>
	<Dropdown
		selectRenderer={(args) => <AccountSummary user={user} {...args} />}
		dropdownRenderer={(args) => <SignOutForm user={user} {...args} />}
	/>

Account.propTypes = {
	user: PropTypes.object.isRequired
}

export default Account
