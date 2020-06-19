/*
Copyright 2020 Hitachi Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/*
Copyright (c) 2016, LiveBy

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

import ReactDOM from "react-dom";
import { MapControl, withLeaflet } from "react-leaflet";
import { Control, DomUtil, DomEvent } from "leaflet";

const DumbControl = Control.extend({
  options: {
    className: "",
    onOff: "",
    handleOff: function noop() {},
  },

  onAdd(map) {
    var _controlDiv = DomUtil.create("div", this.options.className);
    DomEvent.on(_controlDiv, "mouseover touchstart", () => {
      map.dragging.disable();
    });
    DomEvent.on(_controlDiv, "mouseout touchend", () => {
      map.dragging.enable();
    });
  
    return _controlDiv;
  },

  onRemove(map) {
    if (this.options.onOff) {
      map.off(this.options.onOff, this.options.handleOff, this);
    }

    return this;
  }
});

export default withLeaflet(
  class LeafletControl extends MapControl {
    createLeafletElement(props) {
      return new DumbControl(Object.assign({}, props));
    }

    componentDidMount() {
      super.componentDidMount();

      // This is needed because the control is only attached to the map in
      // MapControl's componentDidMount, so the container is not available
      // until this is called. We need to now force a render so that the
      // portal and children are actually rendered.
      this.forceUpdate();
    }

    render() {
      if (!this.leafletElement || !this.leafletElement.getContainer()) {
        return null;
      }
      return ReactDOM.createPortal(
        this.props.children,
        this.leafletElement.getContainer()
      );
    }
  }
);