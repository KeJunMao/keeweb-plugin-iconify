/// @ts-ignore
import { FileModel } from "models/file-model";
/// @ts-ignore
import { IconUrlFormat } from "util/formatting/icon-url-format";

/// @ts-ignore
import kdbxweb from "kdbxweb";

function addCustomIcon(iconData) {
  if (iconData.includes("#iconify#")) {
    const customIcons = this.getCustomIcons();
    for (let key in customIcons) {
      if (customIcons[key] === iconData) {
        return key;
      }
    }
    const uuid = kdbxweb.KdbxUuid.random();
    this.db.meta.customIcons.set(uuid.id, {
      data: kdbxweb.ByteUtils.arrayToBuffer(
        kdbxweb.ByteUtils.stringToBytes(iconData)
      ),
      lastModified: new Date(),
    });
    return uuid.toString();
  }
  KeewebPluginIconifyFileModel.call(this, iconData);
}

function getCustomIcons() {
  const customIcons = {};
  for (const [id, icon] of this.db.meta.customIcons) {
    const iconData = kdbxweb.ByteUtils.bytesToString(icon.data);
    if (iconData.includes("#iconify#")) {
      customIcons[id] = iconData;
    } else {
      customIcons[id] = IconUrlFormat.toDataUrl(icon.data);
    }
  }
  return customIcons;
}

export default class KeewebPluginIconifyFileModel {
  static addCustomIcon = FileModel.prototype.addCustomIcon;
  static getCustomIcons = FileModel.prototype.getCustomIcons;

  constructor() {
    this.install();
  }

  install() {
    FileModel.prototype.addCustomIcon = addCustomIcon;
    FileModel.prototype.getCustomIcons = getCustomIcons;
  }

  uninstall() {
    FileModel.prototype.addCustomIcon =
      KeewebPluginIconifyFileModel.addCustomIcon;

    FileModel.prototype.getCustomIcons =
      KeewebPluginIconifyFileModel.getCustomIcons();
  }
}
