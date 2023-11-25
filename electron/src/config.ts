import { app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { tryCatch } from './utils';
import { OutputSetting } from './modules/tools/image';

interface IConfig {
  /**
   * 配置文件存放路径
   */
  dir: string

  /**
   * 图片输出路径
   */
  output: string

  /**
   * 缓存存放目录
   */
  cacheDir: string

  options: OutputSetting
}

export const DefaultConfig: IConfig = {
  dir: path.join(app.getPath('userData'), 'config.json'),
  output: path.join(app.getPath('pictures'), 'watermark'),
  cacheDir: path.join(app.getPath('temp'), 'yiyin'),

  options: {
    landscape: false,
    ext_show: true,
    model_show: true,
    brand_show: true,
    solid_bg: false,
    origin_wh_output: true,
    radius: 2.1,
    shadow: 6,
    bg_rate: {
      w: 0,
      h: 0,
    },
  },
};

export function getConfig(def = false) {
  const config:IConfig = JSON.parse(JSON.stringify(DefaultConfig));

  if (!def && fs.existsSync(config.dir)) {
    const content = fs.readFileSync(config.dir);
    const fileConfig = tryCatch(() => JSON.parse(content.toString()), {});
    Object.assign(config, {
      dir: fileConfig.dir || config.dir,
      output: fileConfig.output || config.output,
      cacheDir: fileConfig.cacheDir || config.cacheDir,
      options: Object.assign(config.options, fileConfig.options),
    });
  }

  if (process.env.URL) {
    config.cacheDir = path.join(config.output, '.catch');

    if (!fs.existsSync(config.cacheDir)) {
      fs.mkdirSync(config.cacheDir, { recursive: true });
    }
  }

  return config;
}

export const config = getConfig();
