import * as IconifyIcon from "iconify-icon";
// @ts-ignore
import { IconSelectView } from "views/icon-select-view";
// @ts-ignore
import { View } from "framework/views/view";
// @ts-ignore
import { IconMap } from "const/icon-map";

function createIconEl(icon) {
  return $("<iconify-icon/>")
    .attr({
      icon,
      "data-val": "iconify",
      "data-special": "iconify",
      mode: "svg",
    })
    .addClass("icon-select__icon")
    .clone(false, true);
}

function render() {
  const customIcons = this.model.file.getCustomIcons();
  const customIconify = {};
  for (let key in customIcons) {
    const icon = customIcons[key];
    if (icon.includes("#iconify#")) {
      customIconify[key] = customIcons[key].replace("#iconify#", "");
      delete customIcons[key];
    }
  }
  const hasCustomIcons = Object.keys(customIcons).length > 0;
  this.__proto__.__proto__.render.call(this, {
    sel: this.model.iconId,
    icons: IconMap,
    canDownloadFavicon: !!this.model.url,
    customIcons,
    hasCustomIcons,
  });

  const iconifyContainer = $("<div />").addClass([
    "icon-select__items",
    "icon-select__items--iconify",
  ]);
  let icon = createIconEl("line-md:iconify1");
  const label = $("<label />")
    .attr({
      for: "iconify-input",
    })
    .text("Iconify: ");
  const input = $("<input/>")
    .attr({ placeholder: "Iconify Icon Name", id: "iconify-input" })
    .on({
      input: (e) => {
        e.stopPropagation();
        const iconName = (e.target as HTMLInputElement).value;
        const [prefix, name] = iconName.split(":");
        try {
          if (prefix && name && prefix.length > 1 && name.length > 2) {
            icon.attr({ icon: "eos-icons:loading" });
            IconifyIcon.loadIcon(iconName)
              .then((_) => {
                icon.attr({ icon: iconName });
              })
              .catch((_e) => {});
          }
        } catch (error) {}
      },
      keypress: (e) => e.stopPropagation(),
    });
  iconifyContainer.append(label);
  iconifyContainer.append(input);
  iconifyContainer.append(icon);
  $(this.el).append(iconifyContainer);

  const customIconifyContainer = $("<div />").addClass([
    "icon-select__items",
    "icon-select__items--iconify-icons",
  ]);
  const customIconifyIcons = Object.keys(customIconify).map((iconKey) => {
    const icon = customIconify[iconKey];
    return createIconEl(icon).addClass([
      iconKey === this.model.iconId ? "icon-select__icon--active" : "",
    ]);
  });
  customIconifyContainer.append(customIconifyIcons);
  iconifyContainer.after(customIconifyContainer);
  return this;
}

function iconClick(e) {
  const target = $(e.target).closest(".icon-select__icon");
  const iconId = target.data("val");
  if (iconId === "iconify") {
    const iconName = target.attr("icon");
    const iconData = `#iconify#${iconName}`;
    if (iconData) {
      const id = this.model.file.addCustomIcon(iconData);
      this.emit("select", { id, custom: true });
    }
    e.preventDefault();
    e.stopImmediatePropagation();
  } else {
    KeewebPluginIconifyIconSelectView.iconClick.call(this, e);
  }
}

export default class KeewebPluginIconifyIconSelectView {
  static render = IconSelectView.prototype.render;
  static iconClick = IconSelectView.prototype.iconClick;
  constructor() {
    this.install();
  }

  install() {
    IconSelectView.prototype.render = render;
    IconSelectView.prototype.iconClick = iconClick;
  }

  uninstall() {
    IconSelectView.prototype.render = KeewebPluginIconifyIconSelectView.render;
    IconSelectView.prototype.iconClick =
      KeewebPluginIconifyIconSelectView.iconClick;
  }
}
