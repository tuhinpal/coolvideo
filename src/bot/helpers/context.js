const fs = require('fs');

const steps = ['titleHeading', 'titleSubheading', 'otherTexts', 'endHeading'];

function create(uid) {
	let obj = {
		step: 'titleHeading',
		props: {},
	};

	fs.writeFileSync(`${__dirname}/${uid}.json`, JSON.stringify(obj));
	return obj.step;
}

function get(uid) {
	try {
		return JSON.parse(fs.readFileSync(`${__dirname}/${uid}.json`));
	} catch (error) {
		throw new Error(
			'Context not found. Please create a new context by sending /create'
		);
	}
}

function update(uid, currentStep, props, curr) {
	try {
		let newStep = curr ? currentStep : steps[steps.indexOf(currentStep) + 1];
		fs.writeFileSync(
			`${__dirname}/${uid}.json`,
			JSON.stringify({
				step: newStep,
				props,
			})
		);

		return newStep;
	} catch (error) {
		throw new Error(`Something went wrong. Please try again.`);
	}
}

function remove(uid) {
	try {
		fs.unlinkSync(`${__dirname}/${uid}.json`);
	} catch (error) {
		throw new Error(`Something went wrong. Please try again.`);
	}
}

module.exports = {
	create,
	get,
	update,
	remove,
};
