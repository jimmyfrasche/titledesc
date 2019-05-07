const newId = (() => {
	let n = 0;
	return () => "x-td-generated-id-" + n++;
})();

function idList(elm, name) {
	const attr = elm.getAttribute(name) || "";
	const ids = attr.split(" ").filter(Boolean);

	const idx = ofid => ids.indexOf(ofid);
	const apply = () => {
		if(ids.length) {
			elm.setAttribute(name, ids.join(" "));
		} else {
			elm.removeAttribute(name)
		}
	};
	return new class {
		add(id) {
			if(id && idx(id) == -1) {
				ids.push(id);
				apply();
			}
		}
		remove(id) {
			if(!id) {
				return;
			}
			const i = idx(id);
			if(i != -1) {
				ids.splice(i, 1);
				apply();
			}
		}
	}();
}

function parentOf(elm) {
	const f = elm.getAttribute("for");
	if(f) {
		if(f == elm.id) {
			return null;
		}
		return document.getElementById(f);
	}
	return elm.parentElement;
}

function ariaby(what) {
	const attr = `aria-${what}by`;

	function attach(elm, id) {
		if(elm) {
			idList(elm, attr).add(id)
		}
	}

	function detach(elm, id) {
		if(elm) {
			idList(elm, attr).remove(id)
		}
	}

	return class extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({
				mode: "open",
			});
			this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
				}
				:host([hidden]) {
					display: none;
				}
			</style>
			<slot>`;
			this.parent = null;
		}

		connectedCallback() {
			if(!this.isConnected) {
				return;
			}
			this.parent = parentOf(this);

			if(!this.id) {
				this.setAttribute("id", newId());
			}
			attach(this.parent, this.id);
		}

		disconnectedCallback() {
			if(this.parent) {
				detach(this.parent, this.id);
				this.parent = null;
			}
		}

		static get observedAttributes() {
			return ["id", "for"];
		}

		attributeChangedCallback(name, old, changed) {
			if(name == "id" && old) {
				detach(this.parent, old);
				attach(this.parent, changed);
			} else if(name == "for") {
				this.parent = parentOf(this);
			}
		}
	}
}

customElements.define("x-title", ariaby("labelled"));
customElements.define("x-desc", ariaby("described"));
