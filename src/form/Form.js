import PropTypes from 'prop-types'
import React from 'react'
import styled from '@emotion/styled'
import {Spinner} from '../icons'

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;
	margin: 5px 0;
	justify-content: space-between;
`;

const Col = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	margin: 0 10px;
	:first-of-type {margin-left: 0}
	:last-child {margin-right: 0}
`;

export const Title = styled.h3`
	margin: 5px 0 20px;
	align-self: center;
	font-weight: bold;
	color: #0099CC;
`;

const ErrMsg = styled(Row)`
	color: red;
	font-weight: bold;
	justify-content: center;
`;

const ButtonRow = styled(Row)`
	justify-content: space-around;
`;

const Button = styled.button`
	width: 100px;
	padding: 8px 16px;
	text-transform: uppercase;
	color: white;
	font-weight: bold;
	background-color: #0099CC;
	border: none;
	border-radius: 30px;
	:focus {outline: none}
`;

const FieldContainer = styled.div`
	display: flex;
	align-items: center;
	flex: 1;
	justify-content: space-between;
	/*margin: 10px 0;
	:first-of-type {margin-top: 0}
	:last-child {margin-bottom: 0}*/
	& > label {margin-right: 10px}
`;

const Field = ({style, className, label, children}) =>
	<FieldContainer
		style={style}
		className={className}
	>
		<label>{label}</label>
		{typeof children === 'string'? <span>{children}</span>: children}
	</FieldContainer>

const FieldLeft = styled(Field)`
	justify-content: left;
	flex: unset;
`;

const ListContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const List = ({style, className, label, children}) =>
	<ListContainer
		style={style}
		className={className}
	>
		{label && <label>{label}</label>}
		{children}
	</ListContainer>

const ListItemContainer = styled.div`
	display: flex;
	align-items: center;
	margin: 5px 0 0 10px;
	label {margin: 0 5px}
`;

const ListItem = ({style, className, children}) =>
	<ListItemContainer
		style={style}
		className={className}
	>
		{children}
	</ListItemContainer>

const Form = ({style, className, title, busy, errorText, submit, submitLabel, cancel, close, cancelLabel, children}) => 
	<Container
		style={style}
		className={className}
	>
		{title && <Title>{title}</Title>}
		{busy !== undefined && <Spinner style={{alignSelf: 'center', visibility: busy? 'visible': 'hidden'}}/>}
		{children}
		{errorText !== undefined && <ErrMsg>{errorText || '\u00a0'}</ErrMsg>}
		<ButtonRow>
			{submit && <Button onClick={submit} >{submitLabel || 'OK'}</Button>}
			{(cancel || close) && <Button onClick={cancel || close} >{cancelLabel || 'Cancel'}</Button>}
		</ButtonRow>
	</Container>

Form.propTypes = {
	title: PropTypes.string,
	submit: PropTypes.func,
	cancel: PropTypes.func,
	submitLabel: PropTypes.string,
	cancelLabel: PropTypes.string,
	errorText: PropTypes.string,
	busy: PropTypes.bool,
};

export {
	Form,
	Field,
	FieldLeft,
	Row,
	Col,
	List,
	ListItem
}