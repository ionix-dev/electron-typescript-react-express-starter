import React from "react";

export const App: React.FC = () => {
	return <h2>Apps{process.env.SERVER_PORT}</h2>;
};
