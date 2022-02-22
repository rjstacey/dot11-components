import React from 'react';

const Content = ({ inputRef, props, state, methods }) => {
	const values = props.value;

	return (
		<div
			className='select-content'
		>
			{props.multi?
				values.map((item) => {
					const key = '' + item[props.valueField] + item[props.labelField];
					const el = props.multiSelectItemRenderer({item, props, state, methods});
					return {...el, key}
				}):
				values.length > 0 && props.selectItemRenderer({item: values[0], props, state, methods})
			}
			{props.searchable && !props.readOnly && props.inputRenderer({inputRef, value: state.search, onChange: methods.setSearch})}
		</div>
	)
}

export default Content;
