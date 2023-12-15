import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Row, Col } from "../form";
import { ActionIcon } from "../icons";
import { AppModal } from ".";

import { clearOne, clearAll, selectErrors, ErrorMsg } from "../store/error";

import styles from "./index.module.css";

function MultipleErrorForm({errors}: {errors: ErrorMsg[]}) {
	const dispatch = useDispatch();
	const [index, setIndex] = React.useState<number>(0);

	if (errors.length === 0)
		return null;

	const n = (index > errors.length - 1)? errors.length - 1: index;

	function next() {
		if (n < errors.length)
			setIndex(n + 1);
	}
	function prev() {
		if (index > 0)
			setIndex(n - 1);
	}
	const error = errors[n];

	const dismissOneButton = <Button onClick={() => dispatch(clearOne(n))}>Dismiss</Button>;
	const dismissAllButton = <Button onClick={() => dispatch(clearAll())}>Dismiss All</Button>;
	const navLeft = <ActionIcon className={styles["nav-icon"]} name='prev'	onClick={prev} />;
	const navRight = <ActionIcon className={styles["nav-icon"]}	name='next'	onClick={next} />;

	const dismissActions = errors.length > 1? (
		<>
			{navLeft}
				<div className={styles["dismiss-buttons-stack"]}>
					{dismissOneButton}
					{dismissAllButton}
				</div>
			{navRight}
		</>
	): (
		dismissOneButton
	)


	return (
		<div
			className={styles["error-form"]}
			title={error.summary}
		>
			{errors.length > 1 &&
				<div className={styles["error-count"]}>
					{errors.length} errors
				</div>}

			<h2 className={styles["form-title"]}>{error.summary}</h2>

			{error.detail && error.detail.split('\n').map(s => <p>{s}</p>)}

			<div className={styles["dismiss-buttons"]}>
				{dismissActions}
			</div>
		</div>
	)
}

function ErrorModal() {
	const dispatch = useDispatch();
	const errors = useSelector(selectErrors);

	return (
		<AppModal
			isOpen={errors.length > 0}
			onRequestClose={() => dispatch(clearAll())}
		>
			<MultipleErrorForm errors={errors} />
		</AppModal>
	);
}

export default ErrorModal;
