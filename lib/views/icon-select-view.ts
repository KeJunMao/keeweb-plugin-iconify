import * as IconifyIcon from "iconify-icon";
// @ts-ignore
import { IconSelectView } from "views/icon-select-view";
function render() {
  KeewebPluginIconifyIconSelectView.render.apply(this);

  function IconDataToImage(iconData, onload) {
    if (iconData) {
      const svgSource = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 ${iconData.width} ${iconData.height}">
      ${iconData.body}
    </svg>`;
      const img = new Image(iconData.width, iconData.height);
      const svg = new Blob([svgSource], { type: "image/svg+xml" });
      img.onload = () => {
        onload(img);
      };
      img.src = URL.createObjectURL(svg);
    }
  }

  const iconifyContainer = $("<div />").addClass([
    "icon-select__items",
    "icon-select__items--iconify",
  ]);
  const icon = $("<iconify-icon/>")
    .attr({
      icon: "line-md:iconify1",
      "data-val": "iconify",
      "data-special": "iconify",
    })
    .addClass("icon-select__icon");
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
        if (prefix && name && prefix.length > 1 && name.length > 2) {
          icon.attr({ icon: iconName });
          IconifyIcon.loadIcon(iconName)
            .then((iconData) => {
              IconDataToImage(iconData, (img) => {
                this.setSpecialImage(img, "iconify");
              });
            })
            .catch((_e) => {});
        }
      },
      keypress: (e) => e.stopPropagation(),
    });
  iconifyContainer.append(label);
  iconifyContainer.append(input);
  iconifyContainer.append(icon);
  $(this.el).append(iconifyContainer);
  return this;
}

function iconClick(e) {
  const target = $(e.target).closest(".icon-select__icon");
  const iconId = target[0].getAttribute("data-val");
  if (iconId === "iconify") {
    const iconData = this.special[target.data("special")];
    if (iconData) {
      const id = this.model.file.addCustomIcon(iconData.data);
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
