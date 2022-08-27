/**
 * KeeWeb plugin: keeweb-plugin-iconify
 * @author kejun
 * @license MIT
 */
//@ts-ignore
import * as IconifyIcon from "iconify-icon";
import "./plugin.css";

import KeewebPluginIconifyIconSelectView from "./views/icon-select-view";

class KeewebPluginIconify {
  iconSelectView: KeewebPluginIconifyIconSelectView;
  constructor() {
    this.iconSelectView = new KeewebPluginIconifyIconSelectView();
  }

  uninstall() {
    this.iconSelectView.uninstall();
  }
}

const plugin = new KeewebPluginIconify();
export default plugin;
