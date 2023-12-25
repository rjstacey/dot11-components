import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, ActionButtonDropdown } from "../form";

import type {
	AppTableDataSelectors,
	AppTableDataActions,
} from "../store/appTableData";
import type { ColumnProperties, ChangeableColumnProperties } from "./AppTable";

import styles from "./TableColumnSelector.module.css";

export type ColumnSelectorProps = {
	columns: Array<ColumnProperties>;
	selectors: AppTableDataSelectors<any>;
	actions: AppTableDataActions;
};

function ColumnSelectorDropdown({
	columns,
	selectors,
	actions,
}: ColumnSelectorProps) {
	const dispatch = useDispatch();

	const view = useSelector(selectors.selectCurrentView);
	const tableConfig = useSelector(selectors.selectCurrentTableConfig);

	const toggleCurrentTableFixed = () =>
		dispatch(actions.toggleTableFixed({ tableView: view }));
	const setTableColumnShown = (colKey: string, shown: boolean) =>
		dispatch(
			actions.setTableColumnShown({ tableView: view, key: colKey, shown })
		);

	/* Build an array of 'selectable' column config that includes a column label */
	const selectableColumns: Array<
		ChangeableColumnProperties & { key: string; label: string }
	> = [];
	for (const [key, config] of Object.entries<ChangeableColumnProperties>(
		tableConfig.columns
	)) {
		if (!config.unselectable) {
			const column = columns.find((c) => c.key === key);
			selectableColumns.push({
				key,
				...config,
				label: column && column.label ? column.label : key,
			});
		}
	}

	return (
		<>
			<div className={styles.row}>
				<label>Table view:</label>
				<span>{view}</span>
			</div>
			<div className={styles.row}>
				<label>Fixed width:</label>
				<Button
					onClick={toggleCurrentTableFixed}
					isActive={tableConfig.fixed}
				>
					On
				</Button>
			</div>
			<div className={styles.list}>
				{selectableColumns.map((col) => (
					<div
						key={col.key}
						className={styles.item + (col.shown ? " selected" : "")}
					>
						<input
							type="checkbox"
							checked={col.shown}
							onChange={() =>
								setTableColumnShown(col.key, !col.shown)
							}
						/>
						<span>{col.label}</span>
					</div>
				))}
			</div>
		</>
	);
}

const ColumnSelector = (props: ColumnSelectorProps) => (
	<ActionButtonDropdown name="columns" title="Configure table">
		<ColumnSelectorDropdown {...props} />
	</ActionButtonDropdown>
);

export default ColumnSelector;
