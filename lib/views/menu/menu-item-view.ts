// @ts-ignore
import { MenuItemView } from "views/menu/menu-item-view";

function createIconEl(icon) {
  return $("<iconify-icon/>")
    .attr({
      icon,
      "data-val": "iconify",
      "data-special": "iconify",
      mode: "svg",
    })
    .addClass(["menu__item-icon", "menu__item-icon--iconify"])
    .clone(false, true);
}

function render() {
  KeewebPluginIconifyMenuItemView.render.call(this);
  if (this.model.customIcon?.includes("#iconify#")) {
    $(this.iconEl).replaceWith(
      createIconEl(this.model.customIcon.replace("#iconify#", ""))
    );
  }
}

export default class KeewebPluginIconifyMenuItemView {
  static render = MenuItemView.prototype.render;
  constructor() {
    this.install();
  }

  install() {
    MenuItemView.prototype.render = render;
  }

  uninstall() {
    MenuItemView.prototype.render = KeewebPluginIconifyMenuItemView.render;
  }
}
