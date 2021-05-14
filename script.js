const Store = require("./store.js");
const chalk = require("chalk");
const open = require("open");
const validUrl = require("valid-url");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const error = chalk.bold.red;
const info = chalk.bold.hex("#1565c0");
const store = new Store("./urls.json");

yargs(hideBin(process.argv))
	.command({
		command: "open <alias> [--options?]",
		aliases: ["o"],
		desc: "Open the URL. Use " + info("open -h") + " for optional flags",
		builder: (yargs) =>
			yargs
				.option("ff", {
					alias: "firefox",
					describe: "Opens the URL in Firefox.",
					type: "boolean",
				})
				.option("ffp", {
					alias: "firefox-private",
					describe: "Opens the URL in Firefox Private mode.",
					type: "boolean",
				})
				.option("gc", {
					alias: "chrome",
					describe: "Opens the URL in Google Chrome.",
					type: "boolean",
				})
				.option("gci", {
					alias: "chrome-incognito",
					describe: "Opens the URL in Google Chrome incognito mode.",
					type: "boolean",
				}),
		handler: (argv) => {
			const value = store.get(argv.alias);
			if (value) {
				const options = {};
				if (argv.ff) {
					options["app"] = { name: open.apps.firefox };
				}
				if (argv.ffp) {
					options["app"] = { name: open.apps.firefox, arguments: ["-private"] };
				}
				if (argv.gc) {
					options["app"] = { name: open.apps.chrome };
				}
				if (argv.gci) {
					options["app"] = { name: open.apps.chrome, arguments: ["--incognito"] };
				}
				open(value, options);
			} else console.log(error("ERR:"), "Provide a valid Alias.");
		},
	})
	.command({
		command: "create <alias> <url>",
		aliases: ["c"],
		desc: "Create a new Alias.",
		builder: {},
		handler: (argv) => {
			if (store.get(argv.alias)) console.log(error("ERR:"), "This alias already exists.");
			else {
				if (!validUrl.isWebUri(argv.url)) console.log(error("ERR:"), "Given URL is not a valid URL.");
				else {
					store.set(argv.alias, argv.url);
					console.log(info("INFO:"), "Alias has been Created.");
				}
			}
		},
	})
	.command({
		command: "update <alias> <url>",
		aliases: ["u"],
		desc: "Update an existing Alias.",
		builder: {},
		handler: (argv) => {
			if (!store.get(argv.alias)) console.log(error("ERR:"), "This alias does not exist.");
			else {
				if (!validUrl.isWebUri(argv.url)) console.log(error("ERR:"), "Given URL is not a valid URL.");
				else {
					store.set(argv.alias, argv.url);
					console.log(info("INFO:"), "Alias has been Updated.");
				}
			}
		},
	})
	.command({
		command: "delete <alias>",
		aliases: ["d"],
		desc: "Create a new Alias.",
		builder: {},
		handler: (argv) => {
			if (!store.get(argv.alias)) console.log(error("ERR:"), "Alias does not exist.");
			else {
				store.delete(argv.alias);
				console.log(info("INFO:"), "Alias has been Deleted.");
			}
		},
	})
	.command({
		command: "all",
		aliases: ["a"],
		desc: "Display all Alias.",
		builder: {},
		handler: (argv) => {
			const urls = store.getStore();
			for (let i in urls) console.log(chalk.hex("#ffd600")(i), "=>", urls[i]);
		},
	})
	.help()
	.wrap(92)
	.alias("h", "help").argv;
