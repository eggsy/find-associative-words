import { exec } from "child_process";
import { networkInterfaces } from "os";
import { setErrorLevel, generate } from "qrcode-terminal";

export const openBrowser = () => {
  const isMac = process.platform === "darwin" && "open";
  const isWin32 = process.platform === "win32" && "start";
  const isLinux = "xdg-open";

  const startCmd = isMac || isWin32 || isLinux;
  const networkIp = networkInterfaces()?.en0?.find(
    (item) => item.family === "IPv4"
  )?.address;

  if (!networkIp) return;

  console.info("ℹ️  Scan this code to access control page");

  setErrorLevel("L");
  generate(`http://${networkIp}:4455/control`, { small: true });

  exec(`${startCmd} "http://${networkIp}:4455/"`);
};
