import React from 'react';
import styled from '@emotion/styled';
import { LIB_NAME } from './constants';
import {getByPath} from './util';

const Content = ({ props, state, methods }) => {

	const cn = `${LIB_NAME}-content ${LIB_NAME}-type-${props.multi? 'multi': 'single'}`;

	return (
		<ContentComponent
			className={cn}
		>
			{state.values &&
				props.multi?
					state.values.map((item) => {
						const key = `${getByPath(item, props.valueField)}${getByPath(item, props.labelField)}`;
						const el = props.optionRenderer({item, props, state, methods});
						return {...el, key}
					}):
					state.values.length > 0 && <span>{getByPath(state.values[0], props.labelField)}</span>
			}
			{props.searchable && props.inputRenderer({props, state, methods})}
		</ContentComponent>
	)
}

const ContentComponent = styled.div`
	display: flex;
	flex: 1;
	flex-wrap: wrap;
`;

export default Content;
