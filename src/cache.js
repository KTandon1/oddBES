var names = [];

function Cache(name, pruneTime) {
    this.name = name;
    this.storage = JSON.parse(localStorage.getItem(name) || "{}");
    this.pruneTime = pruneTime || 1000;

    names.push(name);
}

Cache.prototype.get = function (name) {
    var updated = this.prune();

    if (this.storage[name]) {
        if (updated) this.save();
        return {value: this.storage[name].json};
    }

    return {update: true};
};

Cache.prototype.set = function (name, json) {
    this.storage[name] = {time: Date.now() + this.pruneTime, json: json};
    return this;
};

Cache.prototype.rm = function (name) {
    delete this.storage[name];
    return this;
};

Cache.prototype.save = function () {
    localStorage.setItem(this.name, JSON.stringify(this.storage));
    return this;
};

Cache.prototype.timeout = function (t) {
    this.pruneTime = t;
    return this;
};

Cache.prototype.prune = function () {
    var updated = false,
        time, uid;

    for (uid in this.storage) {
        time = this.storage[uid].time;

        if (Date.now() > time) {
            updated = true;
            delete this.storage[uid];
        }
    }

    return updated;
};

module.exports = Cache;
module.exports.names = names;
