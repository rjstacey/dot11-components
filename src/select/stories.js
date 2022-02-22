import React from 'react';
import styled from '@emotion/styled';
import { LoremIpsum } from 'lorem-ipsum';
import {AppModal} from '../modals';
import Select from '.';

const story = {
  title: 'Select',
  component: Select,
  args: {
  	numberOfItems: 100,
  }
};

const lorem = new LoremIpsum();

const Container = styled.div`
	display: flex;
	justify-content: space-around;
	overflow: auto;
`;

const SubContainer = styled.div`
	width: 300px;
	height: 200px;
	border: 2px dashed black;
`;

const genOptions = (n) => Array(n).fill().map((value, index) => ({value: index, label: lorem.generateWords(4), disabled: Math.random() > 0.8}));

export const SelectComponent = (args) => {
	const {portal: noop, numberOfItems, ...otherArgs} = args;
	const [select, setSelect] = React.useState([]);
	const portalRef = React.useRef();

	const options = React.useMemo(() => genOptions(numberOfItems), [numberOfItems]);

	return (
		<Container ref={portalRef}>
			<SubContainer>
				<Select
					options={options}
					value={select}
					onChange={setSelect}
					portal={portalRef.current}
					{...otherArgs}
				/>
			</SubContainer>
			<SubContainer>
				<Select
					options={options}
					value={select}
					onChange={setSelect}
					{...args}
				/>
			</SubContainer>
		</Container>
	)
}

export const SelectInModal = (args) => {
	const {portal: noop, numberOfItems, onChange, ...otherArgs} = args;
	const [select, setSelect] = React.useState([]);
	const portal = document.querySelector('#root');

	const options = React.useMemo(() => genOptions(numberOfItems), [numberOfItems]);

	return (
		<AppModal
			isOpen={true}
		>
			<SubContainer>
				<Select
					options={options}
					value={select}
					onChange={setSelect}
					portal={portal}
					{...otherArgs}
				/>
			</SubContainer>
		</AppModal>
	)
}


export default story;
