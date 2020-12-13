const open = require("open");
const fs = require("fs");
const validUrl = require("valid-url");
var argv = require("minimist")(process.argv.slice(2), {
	boolean: ["all", "help"],
	alias: {
		c: "create",
		u: "update",
		d: "delete",
		a: "all",
		h: "help",
	},
});

let urls = {};

try {
	urls = require("./urls.json");
} catch (err) {
	console.log("\nNo File Found. One will be created later.");
}

(async () => {
	let isWrite = false;
	let action = "";

	if (argv.create) {
		const alias = argv.create;

		if (urls[alias]) {
			console.log("\nAlias Already Exists.\n");
			return;
		}

		if (argv._.length === 0) {
			console.log("\nNo URL Provided.\n");
			return;
		}

		if (!validUrl.isWebUri(argv._[0])) {
			console.log("\nInvalid URL Provided.\n");
			return;
		}

		urls[alias] = argv._[0];
		argv._.shift();
		isWrite = true;
		action = "Create";
	}

	if (argv.update) {
		const alias = argv.update;

		if (!urls[alias]) {
			console.log("\nAlias does not Exist.");
			return;
		}

		if (argv._.length === 0) {
			console.log("\nNo URL Provided.\n");
			return;
		}

		if (!validUrl.isWebUri(argv._[0])) {
			console.log("\nInvalid URL Provided.\n");
			return;
		}

		urls[alias] = argv._[0];
		argv._.shift();
		isWrite = true;
		action = "Update";
	}

	if (argv.delete) {
		const alias = argv.delete;

		if (!urls[alias]) {
			console.log("\nAlias does not Exist.\n");
			return;
		}

		delete urls[alias];
		argv._.shift();
		isWrite = true;
		action = "Delete";
	}

	if (argv.all) {
		console.log("\n");
		for (let i in urls) console.log(i, " => ", urls[i]);
		console.log("\n");
		return;
	}

	if (argv.help) {
		console.log("\n");
		console.log("\tArguments");
		console.log("\t---------");
		console.log("-c  [alias] [valid Web URL] => To create a new alias.");
		console.log("-u  [alias] [valid Web URL] => To update an existing alias.");
		console.log("-d  [alias]                 => To delete an alias.");
		console.log("\n");
		console.log("\tFlags");
		console.log("\t-----");
		console.log("-a  --all   To view all the aliases.");
		console.log("\n");

		return;
	}

	if (isWrite) {
		fs.writeFile("./urls.json", JSON.stringify(urls), (err) => {
			if (!err) console.log("\nOperation " + action + " executed successfully.\n");
			else console.log(err);
		});
	} else {
		if (argv._.length === 0) {
			console.log("\nNo Alias Provided.\n");
			return;
		}
		for (let i of argv._) await open(urls[i]);
	}
})();
