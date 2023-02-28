import PropTypes from 'prop-types';
import React from 'react';
import {ButtonGroup} from '../form';
import TableViewSelector from './TableViewSelector';
import TableColumnSelector from './TableColumnSelector';
import {SplitPanelButton} from './SplitPanel';

export function SplitTableButtonGroup({dataSet, columns, ...otherProps}) {
	return (
		<ButtonGroup>
			<div>Table view</div>
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<TableViewSelector dataSet={dataSet} />
				<TableColumnSelector dataSet={dataSet} columns={columns} />
				<SplitPanelButton dataSet={dataSet} />
			</div>
		</ButtonGroup>
	)
}

SplitTableButtonGroup.propTypes = {
	dataSet: PropTypes.string.isRequired,
	columns: PropTypes.array.isRequired
}

export default SplitTableButtonGroup;
