import axios from "axios";
//上传文件 千牛
export function uploadApi(file, cb) {
    // const file = params.file;
    // 根据后台需求数据格式
    const fd = new FormData();
    fd.append("upload", file); //参数
    axios
      .post("http://139.159.146.109:9530/v1/file/upload", fd)
      .then((res) => {
        cb(res.data.data);
      })
      .catch((err) => {});
  }
