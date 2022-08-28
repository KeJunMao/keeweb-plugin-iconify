//@ts-ignore
import { GroupModel } from "models/group-model";
/// @ts-ignore
import kdbxweb from "kdbxweb";

function _buildCustomIcon() {
  this.customIcon = null;
  if (this.group.customIcon) {
    const customIcon = kdbxweb.ByteUtils.bytesToString(
      this.file.db.meta.customIcons.get(this.group.customIcon.id)?.data
    );
    if (customIcon.includes("#iconify#")) {
      return customIcon;
    }
  }
  KeewebPluginIconifyGroupModel._buildCustomIcon.apply(this);
}

export default class KeewebPluginIconifyGroupModel {
  static _buildCustomIcon = GroupModel.prototype._buildCustomIcon;
  constructor() {
    this.install();
  }

  install() {
    GroupModel.prototype._buildCustomIcon = _buildCustomIcon;
  }

  uninstall() {
    GroupModel.prototype._buildCustomIcon =
      KeewebPluginIconifyGroupModel._buildCustomIcon;
  }
}
