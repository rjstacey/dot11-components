import React from 'react';

import {
	Form,
	Field,
	FieldLeft,
	Row,
	Col,
	List,
	ListItem,
	Select,
	Input,
	TextArea,
	Checkbox
} from './Form';

export default {
  title: 'Form',
  component: Form,
  argTypes: {
  	title: {type: 'string', defaultValue: 'Some sort of title'},
  	errorText: {type: 'string', defaultValue: 'Something wrong'},
  	submitLabel: 'Submit Me',
  	cancelLabel: 'Cancel Me',
  	busy: {type: 'boolean', defaultValue: false},
  	submit: {action: 'submit'},
  	cancel: {action: 'cancel'}
  }
};

export const EmptyForm = (args) => <Form {...args} />

export const ThreeRowsForm = (args) =>
	<Form {...args}>
		<Row>Row one...</Row>
		<Row>Row two...</Row>
		<Row>Row three...</Row>
	</Form>;

export const FormWithList = (args) =>
	<Form {...args}>
		<List label='A label:'>
			<ListItem>Item one...</ListItem>
			<ListItem>Item two...</ListItem>
			<ListItem>Item three...</ListItem>
		</List>
	</Form>

export const TwoColsForm = (args) =>
	<Form {...args}>
		<Row>
			<Col>
				<List label='Label one:'>
					<ListItem><Field label={'Text:'}><Input type='text' /></Field></ListItem>
					<ListItem><Field label={'Text area:'}><TextArea /></Field></ListItem>
					<ListItem><Field label={'Date:'}><Input type='date' /></Field></ListItem>
					<ListItem><Field label={'Search:'}><Input type='search' /></Field></ListItem>
				</List>
			</Col>
			<Col>
				<List label='Label two:'>
					<ListItem>Item one...</ListItem>
					<ListItem>Item two...</ListItem>
					<ListItem>Item three...</ListItem>
				</List>
			</Col>
		</Row>
		<Row>Row two...</Row>
		<Row>Row three...</Row>
	</Form>;
