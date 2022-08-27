/**
 * KeeWeb plugin: keeweb-plugin-iconify
 * @author kejun
 * @license MIT
 */
//@ts-ignore
import * as IconifyIcon from "iconify-icon";
import "./plugin.css";

import KeewebPluginIconifyIconSelectView from "./views/icon-select-view";

import KeewebPluginIconifyFileModel from "./models/file-model";
import KeewebPluginIconifyEntryModel from "./models/entry-model";

class KeewebPluginIconify {
  iconSelectView: KeewebPluginIconifyIconSelectView;
  fileModel: KeewebPluginIconifyFileModel;
  entryModel: KeewebPluginIconifyEntryModel;

  constructor() {
    this.iconSelectView = new KeewebPluginIconifyIconSelectView();
    this.fileModel = new KeewebPluginIconifyFileModel();
    this.entryModel = new KeewebPluginIconifyEntryModel();
  }

  uninstall() {
    this.iconSelectView.uninstall();
    this.fileModel.uninstall();
    this.entryModel.uninstall();
  }
}

const plugin = new KeewebPluginIconify();
export default plugin;
