//@ts-ignore
import { EntryModel } from "models/entry-model";
/// @ts-ignore
import kdbxweb from "kdbxweb";

function _buildCustomIcon() {
  this.customIcon = null;
  this.customIconId = null;
  if (this.entry.customIcon) {
    this.customIcon = kdbxweb.ByteUtils.bytesToString(
      this.file.db.meta.customIcons.get(this.entry.customIcon.id)?.data
    );
    this.customIconId = this.entry.customIcon.toString();
    if (!this.customIcon.includes("#iconify#")) {
      KeewebPluginIconifyEntryModel._buildCustomIcon.apply(this);
    }
  }
}

export default class KeewebPluginIconifyEntryModel {
  static _buildCustomIcon = EntryModel.prototype._buildCustomIcon;
  constructor() {
    this.install();
  }

  install() {
    EntryModel.prototype._buildCustomIcon = _buildCustomIcon;
  }

  uninstall() {
    EntryModel.prototype._buildCustomIcon =
      KeewebPluginIconifyEntryModel._buildCustomIcon;
  }
}
