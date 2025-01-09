import * as React from "react";
import Modal from "react-modal";

const defaultModalStyle: {
	content: React.CSSProperties;
	overlay: React.CSSProperties;
} = {
	content: {
		position: "absolute",
		top: "20%",
		left: "50%",
		right: "unset",
		bottom: "unset",
		width: "fit-content",
		maxWidth: "90%",
		maxHeight: "80%",
		overflow: "unset",
		transform: "translate(-50%, 0)",
		padding: "20px",
		background: "#fff",
		border: "1px solid #ccc",
		borderRadius: 5,
		boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
		boxSizing: "border-box",
	},
	overlay: {
		position: "fixed",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0)" /* Black w/ opacity */,
		zIndex: 6,
	},
};

function AppModal({
	style,
	overlayStyle,
	...props
}: {
	style?: React.CSSProperties;
	overlayStyle?: React.CSSProperties;
} & React.ComponentProps<typeof Modal>) {
	const modalStyle = {
		content: { ...defaultModalStyle.content, ...style },
		overlay: { ...defaultModalStyle.overlay, ...overlayStyle },
	};
	return (
		<Modal
			style={modalStyle}
			appElement={document.getElementById("root")!}
			{...props}
		/>
	);
}

export default AppModal;
