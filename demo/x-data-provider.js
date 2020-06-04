import '@polymer/polymer/polymer-legacy.js';
import { GridDemo } from './grid-tree-demos.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
function getJSON(url, callback) {
  if (url.indexOf('randomuser.me') > -1) {
    const index = parseInt(getParameterByName(url, 'index') || 0);
    return JSON.parse(JSON.stringify(users.results[index % users.results.length])); // clone object
  }
}

function getParameterByName(url, name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
    results = regex.exec(url);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const users = {
  results: GridDemo.users,
  nationality: 'FR',
  seed: 'f94158be2e69b5cf03',
  version: '0.7'
};


class XDataProvider extends PolymerElement {
  static get is() {
    return 'x-data-provider';
  }
  static get properties() {
    return {
      loading: {
        type: Boolean,
        notify: true
      },

      delay: {
        type: Number,
        value: 0
      },

      dataProvider: {
        notify: true,
        value: () => {
          const _this = this;
          return (params, callback) => {
            const items = Array.apply(null, {length: params.pageSize})
              .map((item, index) => getJSON('http://randomuser.me?index=' + (index + params.page * params.pageSize)));
            _this.loading = true;
            setTimeout(() => {
              callback(items);
              _this.loading = false;
            }, _this.delay);
          };
        }
      }
    };
  }
}

window.customElements.define(XDataProvider.is, XDataProvider);


class XArrayDataProvider extends PolymerElement {
  static get is() {
    return 'x-array-data-provider';
  }
  static get properties() {
    return {
      size: {
        type: Number,
        value: null
      },
      items: {
        notify: true,
        computed: '_computeItems(size)'
      }
    };
  }
  _computeItems(size) {
    if (size !== null) {
      return users.results.slice(0, size);
    } else {
      return users.results;
    }
  }
}

window.customElements.define(XArrayDataProvider.is, XArrayDataProvider);
