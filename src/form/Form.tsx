import * as React from "react";
import { Spinner } from "../icons";
import styles from "./form.module.css";

const Row = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={styles["row"] + (className ? " " + className : "")}
		{...props}
	/>
);

const Col = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={styles["col"] + (className ? " " + className : "")}
		{...props}
	/>
);

const Field = ({
	className,
	label,
	children,
	...props
}: { label: string } & React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={styles["field"] + (className ? " " + className : "")}
		{...props}
	>
		<label>{label}</label>
		{typeof children === "string" ? <span>{children}</span> : children}
	</div>
);

const FieldLeft = ({
	className,
	...props
}: React.ComponentProps<typeof Field>) => (
	<Field className={"left" + (className ? " " + className : "")} {...props} />
);

const List = ({
	className,
	label,
	children,
	...props
}: { label: string } & React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={styles["list"] + (className ? " " + className : "")}
		{...props}
	>
		{label && <label>{label}</label>}
		{children}
	</div>
);

const ListItem = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={styles["list-item"] + (className ? " " + className : "")}
		{...props}
	/>
);

type FormProps = {
	style?: object;
	className?: string;
	title?: string;
	busy?: boolean;
	errorText?: string;
	submit?: () => void;
	submitLabel?: string;
	cancel?: () => void;
	close?: () => void;
	cancelLabel?: string;
	children?: React.ReactNode;
};

const Form = ({
	style,
	className,
	title,
	busy,
	errorText,
	submit,
	submitLabel,
	cancel,
	close,
	cancelLabel,
	children,
}: FormProps) => (
	<div
		style={style}
		className={styles["form"] + (className ? " " + className : "")}
	>
		{title && <h3 className="title">{title}</h3>}
		{busy !== undefined && (
			<Spinner
				style={{
					alignSelf: "center",
					visibility: busy ? "visible" : "hidden",
				}}
			/>
		)}
		{children}
		{errorText !== undefined && (
			<Row className="error-message">{errorText || "\u00a0"}</Row>
		)}
		<Row className="button-row">
			{submit && (
				<button className="button" onClick={submit}>
					{submitLabel || "OK"}
				</button>
			)}
			{(cancel || close) && (
				<button className="button" onClick={cancel || close}>
					{cancelLabel || "Cancel"}
				</button>
			)}
		</Row>
	</div>
);

export { Form, Field, FieldLeft, Row, Col, List, ListItem };
