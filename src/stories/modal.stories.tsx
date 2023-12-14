import React from "react";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import { Provider, connect } from "react-redux";

import { errorsSlice, setError } from "../store/error";
import {
	AppModal,
	ActionButtonModal,
	ErrorModal,
	ConfirmModal,
} from "../modals";

const story = {
	title: "Modals",
};

const store = configureStore({
	reducer: combineReducers({ [errorsSlice.name]: errorsSlice.reducer }),
	middleware: (getDM) => getDM().concat(createLogger({ collapsed: true })),
});

//type RootState = ReturnType<typeof store.getState>

const Content = () => (
	<form style={{ width: "200px" }}>
		<label>
			<input type="radio" id="1" />
			Fred
		</label>
		<br />
		<label>
			<input type="radio" id="1" />
			Frog
		</label>
		<br />
	</form>
);

const Basic = (args) => (
	<AppModal {...args}>
		<Content />
	</AppModal>
);

Basic.args = {
	isOpen: true,
};

const BasicActionButtonModal = (args) => (
	<ActionButtonModal name="add" title="I have a title" {...args}>
		<Content />
	</ActionButtonModal>
);

BasicActionButtonModal.args = {
	disabled: false,
};

function SendError({ setError }) {
	const [summary, setSummary] = React.useState("");
	const [message, setMessage] = React.useState("");
	return (
		<div>
			<label>
				Summary:{" "}
				<input
					type="text"
					value={summary}
					onChange={(e) => setSummary(e.target.value)}
				/>
			</label>
			<br />
			<label>
				Message:{" "}
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
			</label>
			<br />
			<button onClick={() => setError(summary, message)}>send</button>
		</div>
	);
}

const ConnectedSendError = connect(null, { setError })(SendError);

const Error = () => (
	<Provider store={store}>
		<ConnectedSendError />
		<ErrorModal />
	</Provider>
);

Error.parameters = {
	controls: { hideNoControlsWarning: true },
};

const Confirm = () => {
	const [action, setAction] = React.useState("");
	const check = async () => {
		const ok = await ConfirmModal.show("Are you sure?");
		setAction(ok ? "done" : "not done");
	};
	return (
		<>
			<button onClick={check}>Do it!</button>
			<span>&nbsp;{action}</span>
			<ConfirmModal />
		</>
	);
};

Confirm.parameters = {
	controls: { hideNoControlsWarning: true },
};

export { Basic, BasicActionButtonModal, Error, Confirm };
export default story;
