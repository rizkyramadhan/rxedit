import axios from "axios";
import _ from "lodash";
const url = "http://localhost:4000/";

class ApiClass {
  async dir() {
    const res = _.get(await axios.get(url + "list"), "data.children");
    return res;
  }
  async move(from: string, to: string) {
    await axios.post(url + "move", {
      from,
      to
    });
  }
  async newFile(path: string) {
    await axios.post(url + "new-file", {
      path
    });
  }
  async newDir(path: string) {
    await axios.post(url + "new-dir", { path });
  }

  async del(path: string) {
    await axios.post(url + "del", { path });
  }

  async source(path: string) {
    const res = _.get(await axios.post(url + "source", { path }), "data");
    return res;
  }

  async loadProject() {
    const store = window.localStorage["rx-edit-path"];

    if (!store) return false;

    await axios.post(url + "loadproject", { store });
    return store;
  }

  async newProject() {}
}

export const Api = new ApiClass();
