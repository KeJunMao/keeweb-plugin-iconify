// @ts-ignore
import { ListView } from "views/list-view";

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
  KeewebPluginIconifyListView.render.call(this);
  if (this.itemsContainerEl) {
    $(this.itemsContainerEl)
      .find("img[src*=iconify]")
      .each((_i, el) => {
        const iconId = $(el).attr("src").replace("#iconify#", "");
        $(el).replaceWith(createIconEl(iconId).addClass($(el).attr("class")));
      });
  }
}

export default class KeewebPluginIconifyListView {
  static render = ListView.prototype.render;
  constructor() {
    this.install();
  }

  install() {
    ListView.prototype.render = render;
  }

  uninstall() {
    ListView.prototype.render = KeewebPluginIconifyListView.render;
  }
}
