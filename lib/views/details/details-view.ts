// @ts-ignore
import { DetailsView } from "views/details/details-view";

function createIconEl(icon) {
  return $("<iconify-icon/>")
    .attr({
      icon,
      "data-val": "iconify",
      "data-special": "iconify",
      mode: "svg",
    })
    .addClass("fa")
    .clone(false, true);
}

function render() {
  KeewebPluginIconifyDetailsView.render.call(this);
  if (this.model?.customIcon?.includes("#iconify#")) {
    const iconEl = $("img[src*=iconify].details__header-icon-img");
    iconEl.replaceWith(
      createIconEl(this.model.customIcon.replace("#iconify#", ""))
    );
  }
}

export default class KeewebPluginIconifyDetailsView {
  static render = DetailsView.prototype.render;
  constructor() {
    this.install();
  }

  install() {
    DetailsView.prototype.render = render;
  }

  uninstall() {
    DetailsView.prototype.render = KeewebPluginIconifyDetailsView.render;
  }
}
