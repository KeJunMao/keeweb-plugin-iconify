// @ts-ignore
import { GrpView } from "views/grp-view";

function createIconEl(icon) {
  return $("<iconify-icon/>")
    .attr({
      icon,
      "data-val": "iconify",
      "data-special": "iconify",
      mode: "svg",
    })
    .addClass(["grp__icon", "fa"])
    .clone(false, true);
}

function render() {
  KeewebPluginIconifyGrpView.render.call(this);
  if (this.model.customIcon?.includes("#iconify#")) {
    $(this.el)
      .find(".grp__icon--image")
      .replaceWith(
        createIconEl(this.model.customIcon.replace("#iconify#", ""))
      );
  }
}

export default class KeewebPluginIconifyGrpView {
  static render = GrpView.prototype.render;
  constructor() {
    this.install();
  }

  install() {
    GrpView.prototype.render = render;
  }

  uninstall() {
    GrpView.prototype.render = KeewebPluginIconifyGrpView.render;
  }
}
