import React, { useContext } from "react";
import { Context } from "../store/appContext";
import MoodSelector from '../component/MoodSelector';
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
		<h2 className='text-h1 text-center'>Hey 👋 there ! here you can track your invoices</h2>
      <MoodSelector />
      {/* Other components or content */}
		</div>
	);
};
