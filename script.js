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

console.log();

try {
	urls = require("./urls.json");
} catch (err) {
	console.log("No File Found. One will be created later.");
}

(async () => {
	let isWrite = false;
	let action = "";

	if (argv.create) {
		const alias = argv.create;

		if (typeof alias != "string") {
			console.log("No Alias Provided.");
			return;
		}

		if (urls[alias]) {
			console.log("Alias Already Exists.");
			return;
		}

		if (argv._.length === 0) {
			console.log("No URL Provided.");
			return;
		}

		if (!validUrl.isWebUri(argv._[0])) {
			console.log("Invalid URL Provided.");
			return;
		}

		urls[alias] = argv._[0];
		argv._.shift();
		isWrite = true;
		action = "Create";
	}

	if (argv.update) {
		const alias = argv.update;

		if (typeof alias != "string") {
			console.log("No Alias Provided.");
			return;
		}

		if (!urls[alias]) {
			console.log("Alias does not Exist.");
			return;
		}

		if (argv._.length === 0) {
			console.log("No URL Provided.");
			return;
		}

		if (!validUrl.isWebUri(argv._[0])) {
			console.log("Invalid URL Provided.");
			return;
		}

		urls[alias] = argv._[0];
		argv._.shift();
		isWrite = true;
		action = "Update";
	}

	if (argv.delete) {
		const alias = argv.delete;

		if (typeof alias != "string") {
			console.log("No Alias Provided.");
			return;
		}

		if (!urls[alias]) {
			console.log("Alias does not Exist.");
			return;
		}

		delete urls[alias];
		argv._.shift();
		isWrite = true;
		action = "Delete";
	}

	if (argv.all) {
		for (let i in urls) console.log(i, " => ", urls[i]);
		return;
	}

	if (argv.help) {
		console.log(`
		\n
		\tArguments
		\t---------
		-c  [alias] [valid Web URL] => To create a new alias.
		-u  [alias] [valid Web URL] => To update an existing alias.
		-d  [alias]                 => To delete an alias.
		\n\n
		\tFlags
		\t-----
		-a  --all   To view all the aliases.
		-h  --help  To view help.
		`);

		return;
	}

	if (isWrite) {
		fs.writeFile("./urls.json", JSON.stringify(urls), (err) => {
			if (!err) console.log("Operation " + action + " executed successfully.");
			else console.log(err);
		});
	} else {
		if (argv._.length === 0) {
			console.log("No Alias Provided.");
			return;
		}

		for (let i of argv._) {
			if (urls[i]) {
				console.log("Opening", urls[i]);
				await open(urls[i]);
			} else console.log(`"${i}" alias does not exist.`);
		}
	}
})();

console.log();
