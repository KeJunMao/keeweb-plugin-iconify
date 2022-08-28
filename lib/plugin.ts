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
import KeewebPluginIconifyGroupModel from "./models/group-model";
import KeewebPluginIconifyMenuItemView from "./views/menu/menu-item-view";
import KeewebPluginIconifyDetailsView from "./views/details/details-view";
import KeewebPluginIconifyListView from "./views/list-view";
import KeewebPluginIconifyGrpView from "./views/grp-view";

class KeewebPluginIconify {
  iconSelectView: KeewebPluginIconifyIconSelectView;
  fileModel: KeewebPluginIconifyFileModel;
  entryModel: KeewebPluginIconifyEntryModel;
  groupModel: KeewebPluginIconifyGroupModel;
  menuItemView: KeewebPluginIconifyMenuItemView;
  detailsView: KeewebPluginIconifyDetailsView;
  listView: KeewebPluginIconifyListView;
  grpView: KeewebPluginIconifyGrpView;

  constructor() {
    this.iconSelectView = new KeewebPluginIconifyIconSelectView();
    this.fileModel = new KeewebPluginIconifyFileModel();
    this.entryModel = new KeewebPluginIconifyEntryModel();
    this.groupModel = new KeewebPluginIconifyGroupModel();
    this.menuItemView = new KeewebPluginIconifyMenuItemView();
    this.detailsView = new KeewebPluginIconifyDetailsView();
    this.listView = new KeewebPluginIconifyListView();
    this.grpView = new KeewebPluginIconifyGrpView();
  }

  uninstall() {
    this.iconSelectView.uninstall();
    this.fileModel.uninstall();
    this.entryModel.uninstall();
    this.groupModel.uninstall();
    this.menuItemView.uninstall();
    this.detailsView.uninstall();
    this.listView.uninstall();
    this.grpView.uninstall();
  }
}

const plugin = new KeewebPluginIconify();
export default plugin;
