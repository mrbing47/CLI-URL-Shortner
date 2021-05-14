const fs = require("fs");
module.exports = class Store {
	constructor(filepath) {
		this.filepath = filepath.trim();
		try {
			this.store = JSON.parse(fs.readFileSync(filepath, "utf8"));
		} catch (e) {
			this.store = {};
		}
	}

	get(key) {
		key = key.trim();
		return this.store[key];
	}

	getStore() {
		return { ...this.store };
	}

	set(key, value) {
		key = key.trim();
		value = value.trim();
		this.store[key] = value;
		fs.writeFileSync(this.filepath, JSON.stringify(this.store));
		return [true, null];
	}

	delete(key) {
		key = key.trim();
		delete this.store[key];
		fs.writeFileSync(this.filepath, JSON.stringify(this.store));
	}
};
