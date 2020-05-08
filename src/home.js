/**
 * Example of ES6 code to test Babel transpilation and shared code
 */

import 'vlitejs';
import './bootstrap.css';

class Games {}
const Ravalynn = new Games();

export const component = ((d = 'delta') => {
	const obj = { a: 'alpha', b: 'bravo' };
	const newObj = { ...obj, c: 'charlie', d };
	return newObj;
})();

const getDatas = async function () {
	const request = fetch(
		'https://swapi.dev/api/people/?page=1'
	).then((response) => response.json());
	return Promise.all([request]);
};
const init = async function () {
	return await getDatas();
};
init().then((response) => console.log(response));
