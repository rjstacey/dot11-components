import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "../form";

import type {
	AppTableDataSelectors,
	AppTableDataActions,
} from "../store/appTableData";

type TableViewSelectorProps = {
	selectors: AppTableDataSelectors<any>;
	actions: AppTableDataActions;
};

function TableViewSelector({ selectors, actions }: TableViewSelectorProps) {
	const dispatch = useDispatch();

	const currentView = useSelector(selectors.selectCurrentView);
	const allViews = useSelector(selectors.selectViews);

	return (
		<>
			{allViews.map((view) => (
				<Button
					key={view}
					isActive={currentView === view}
					onClick={() =>
						dispatch(actions.setTableView({ tableView: view }))
					}
				>
					{view}
				</Button>
			))}
		</>
	);
}

export default TableViewSelector;
